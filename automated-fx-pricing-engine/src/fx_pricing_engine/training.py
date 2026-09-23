from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, log_loss, roc_auc_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from fx_pricing_engine.features import FEATURE_NAMES, feature_values


ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "fill_model.joblib"
METRICS_PATH = ARTIFACT_DIR / "model_metrics.json"
RANDOM_SEED = 42
BASE_MID_BY_PAIR = {"EUR/USD": 1.1724, "USD/CAD": 1.3815, "GBP/USD": 1.3472}


def synthetic_fill_probability(row: dict[str, Any]) -> float:
    spread = float(row["spread_pips"])
    notional = float(row["notional_millions"])
    volatility = float(row["volatility_bps"])
    liquidity = float(row["liquidity_score"])
    imbalance = float(row["order_book_imbalance"])
    adverse_imbalance = imbalance if row["side"] == "buy" else -imbalance

    score = 2.85
    score -= 1.25 * spread
    score -= 0.34 * np.log1p(notional)
    score -= 0.105 * volatility
    score += 1.65 * liquidity
    score -= 0.55 * adverse_imbalance
    score += {1: 0.55, 2: 0.2, 3: -0.15}[int(row["client_tier"])]
    score += {"EUR/USD": 0.18, "GBP/USD": -0.08, "USD/CAD": 0.0}[str(row["currency_pair"])]
    score -= 0.035 * spread * volatility
    score -= 0.5 * float(notional > 20)
    score += 0.35 * float(liquidity > 0.82 and volatility < 4)
    score -= 0.12 * np.log1p(float(row["validity_seconds"]) / 30)
    return float(1 / (1 + np.exp(-score)))


def generate_synthetic_rfqs(samples: int, seed: int = RANDOM_SEED) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    features: list[list[float]] = []
    outcomes: list[int] = []

    for _ in range(samples):
        row: dict[str, Any] = {
            "currency_pair": str(rng.choice(["EUR/USD", "GBP/USD", "USD/CAD"], p=[0.5, 0.25, 0.25])),
            "side": str(rng.choice(["buy", "sell"])),
            "notional_millions": float(np.clip(rng.lognormal(1.6, 0.85), 0.1, 100)),
            "volatility_bps": float(np.clip(rng.gamma(2.2, 2.0), 0, 50)),
            "liquidity_score": float(rng.beta(5, 2)),
            "order_book_imbalance": float(np.clip(rng.normal(0, 0.4), -1, 1)),
            "client_tier": int(rng.choice([1, 2, 3], p=[0.3, 0.45, 0.25])),
            "validity_seconds": int(rng.choice([15, 30, 60, 120, 300], p=[0.1, 0.2, 0.45, 0.2, 0.05])),
            "spread_pips": float(rng.uniform(0.4, 3.0)),
        }
        probability = synthetic_fill_probability(row)
        features.append(feature_values(**row))
        outcomes.append(int(rng.random() < probability))

    return np.asarray(features, dtype=float), np.asarray(outcomes, dtype=int)


def expected_calibration_error(y_true: np.ndarray, probabilities: np.ndarray, bins: int = 10) -> float:
    edges = np.linspace(0, 1, bins + 1)
    error = 0.0
    for lower, upper in zip(edges[:-1], edges[1:]):
        mask = (probabilities >= lower) & (probabilities < upper)
        if mask.any():
            error += float(mask.mean()) * abs(float(y_true[mask].mean()) - float(probabilities[mask].mean()))
    return error


def evaluate_model(model: Any, x_test: np.ndarray, y_test: np.ndarray) -> dict[str, float]:
    probabilities = model.predict_proba(x_test)[:, 1]
    return {
        "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "log_loss": round(float(log_loss(y_test, probabilities)), 4),
        "brier_score": round(float(brier_score_loss(y_test, probabilities)), 4),
        "expected_calibration_error": round(expected_calibration_error(y_test, probabilities), 4),
    }


def gross_edge_usd(row: dict[str, Any], spread_pips: float) -> float:
    notional = float(row["notional_millions"]) * 1_000_000
    gross_edge = notional * 0.0001 * spread_pips / 2
    adverse_selection = (
        notional
        * 0.0001
        * float(row["volatility_bps"])
        * (1 - float(row["liquidity_score"]))
        * 0.08
    )
    return gross_edge - adverse_selection


def backtest(model: Any, samples: int = 2_000, seed: int = RANDOM_SEED + 1) -> dict[str, Any]:
    rng = np.random.default_rng(seed)
    spreads = np.arange(0.4, 3.01, 0.2)
    strategies = {"fixed_1_pip": [], "model_optimized": [], "oracle": []}
    fill_probabilities = {name: [] for name in strategies}
    selected_spreads = {name: [] for name in strategies}

    for _ in range(samples):
        context: dict[str, Any] = {
            "currency_pair": str(rng.choice(["EUR/USD", "GBP/USD", "USD/CAD"], p=[0.5, 0.25, 0.25])),
            "side": str(rng.choice(["buy", "sell"])),
            "notional_millions": float(np.clip(rng.lognormal(1.6, 0.85), 0.1, 100)),
            "volatility_bps": float(np.clip(rng.gamma(2.2, 2.0), 0, 50)),
            "liquidity_score": float(rng.beta(5, 2)),
            "order_book_imbalance": float(np.clip(rng.normal(0, 0.4), -1, 1)),
            "client_tier": int(rng.choice([1, 2, 3], p=[0.3, 0.45, 0.25])),
            "validity_seconds": int(rng.choice([15, 30, 60, 120, 300], p=[0.1, 0.2, 0.45, 0.2, 0.05])),
        }
        candidate_rows = [{**context, "spread_pips": float(spread)} for spread in spreads]
        x_candidates = np.asarray([feature_values(**row) for row in candidate_rows])
        predicted = model.predict_proba(x_candidates)[:, 1]
        actual = np.asarray([synthetic_fill_probability(row) for row in candidate_rows])
        edges = np.asarray([gross_edge_usd(row, float(spread)) for row, spread in zip(candidate_rows, spreads)])

        choices = {
            "fixed_1_pip": int(np.argmin(np.abs(spreads - 1.0))),
            "model_optimized": int(np.argmax(predicted * edges)),
            "oracle": int(np.argmax(actual * edges)),
        }
        for strategy, index in choices.items():
            strategies[strategy].append(float(actual[index] * edges[index]))
            fill_probabilities[strategy].append(float(actual[index]))
            selected_spreads[strategy].append(float(spreads[index]))

    summary: dict[str, Any] = {}
    for strategy in strategies:
        summary[strategy] = {
            "mean_expected_pnl_usd": round(float(np.mean(strategies[strategy])), 2),
            "mean_fill_probability": round(float(np.mean(fill_probabilities[strategy])), 4),
            "mean_spread_pips": round(float(np.mean(selected_spreads[strategy])), 2),
        }
    baseline = summary["fixed_1_pip"]["mean_expected_pnl_usd"]
    optimized = summary["model_optimized"]["mean_expected_pnl_usd"]
    summary["model_uplift_vs_fixed_pct"] = round((optimized / baseline - 1) * 100, 2)
    return summary


def train(samples: int, output_dir: Path = ARTIFACT_DIR) -> dict[str, Any]:
    x, y = generate_synthetic_rfqs(samples)
    train_end = int(samples * 0.7)
    validation_end = int(samples * 0.85)
    x_train, y_train = x[:train_end], y[:train_end]
    x_validation, y_validation = x[train_end:validation_end], y[train_end:validation_end]
    x_test, y_test = x[validation_end:], y[validation_end:]

    logistic_base = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1_000, random_state=RANDOM_SEED))
    boosted_base = HistGradientBoostingClassifier(
        learning_rate=0.07,
        max_iter=160,
        max_leaf_nodes=15,
        l2_regularization=0.2,
        monotonic_cst=[-1, -1, -1, 1, 0, -1, 0, 0, 0, 0, 0],
        random_state=RANDOM_SEED,
    )
    logistic = CalibratedClassifierCV(logistic_base, method="sigmoid", cv=3)
    boosted = CalibratedClassifierCV(boosted_base, method="sigmoid", cv=3)
    logistic.fit(x_train, y_train)
    boosted.fit(x_train, y_train)

    candidates = {"logistic_regression": logistic, "hist_gradient_boosting": boosted}
    validation_metrics = {name: evaluate_model(model, x_validation, y_validation) for name, model in candidates.items()}
    winner_name = min(candidates, key=lambda name: validation_metrics[name]["log_loss"])
    winner = candidates[winner_name]
    test_metrics = {name: evaluate_model(model, x_test, y_test) for name, model in candidates.items()}

    metadata = {
        "model_name": f"synthetic_fx_{winner_name}",
        "model_version": "2026.09-trained-v1",
        "selected_model": winner_name,
        "training_samples": samples,
        "train_samples": len(x_train),
        "validation_samples": len(x_validation),
        "test_samples": len(x_test),
        "random_seed": RANDOM_SEED,
        "data_source": "synthetic RFQ generator",
        "feature_names": list(FEATURE_NAMES),
        "base_mid_by_pair": BASE_MID_BY_PAIR,
    }
    report = {
        **metadata,
        "validation_metrics": validation_metrics,
        "test_metrics": test_metrics,
        "backtest": backtest(winner),
    }
    artifact = {"predictor": winner, "metadata": metadata, "report": report}

    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, output_dir / MODEL_PATH.name)
    (output_dir / METRICS_PATH.name).write_text(json.dumps(report, indent=2) + "\n")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Train and evaluate the synthetic FX fill model")
    parser.add_argument("--samples", type=int, default=50_000)
    parser.add_argument("--output-dir", type=Path, default=ARTIFACT_DIR)
    args = parser.parse_args()
    if args.samples < 5_000:
        parser.error("--samples must be at least 5000 for stable evaluation")
    report = train(args.samples, args.output_dir)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
