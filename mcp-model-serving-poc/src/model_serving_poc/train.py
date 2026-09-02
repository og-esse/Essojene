from __future__ import annotations

import csv
import json
import math
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
TRAINING_DATA = PROJECT_ROOT / "data" / "churn_training.csv"
MODEL_PATH = PROJECT_ROOT / "artifacts" / "model.json"
NUMERIC_FEATURES = ["tenure_months", "monthly_charges", "support_tickets"]
FEATURES = [
    "tenure_months",
    "monthly_charges",
    "support_tickets",
    "contract_month_to_month",
    "contract_one_year",
    "contract_two_year",
]


def load_rows() -> list[dict[str, str]]:
    with TRAINING_DATA.open(newline="") as training_file:
        return list(csv.DictReader(training_file))


def train_model(epochs: int = 4000, learning_rate: float = 0.08) -> dict:
    rows = load_rows()
    normalization = _normalization(rows)
    examples = [(_feature_vector(row, normalization), int(row["churned"])) for row in rows]
    weights = {"bias": 0.0, **{feature: 0.0 for feature in FEATURES}}

    for _ in range(epochs):
        gradients = {key: 0.0 for key in weights}

        for features, label in examples:
            score = weights["bias"] + sum(
                weights[feature] * value for feature, value in features.items()
            )
            prediction = 1 / (1 + math.exp(-score))
            error = prediction - label
            gradients["bias"] += error

            for feature, value in features.items():
                gradients[feature] += error * value

        for key in weights:
            weights[key] -= learning_rate * gradients[key] / len(examples)

    return {
        "model_name": "toy_churn_logistic_regression",
        "model_version": "1.0.0",
        "threshold": 0.5,
        "features": FEATURES,
        "weights": weights,
        "normalization": normalization,
    }


def save_model(model: dict, model_path: Path = MODEL_PATH) -> Path:
    model_path.parent.mkdir(parents=True, exist_ok=True)
    with model_path.open("w") as model_file:
        json.dump(model, model_file, indent=2)
        model_file.write("\n")
    return model_path


def _normalization(rows: list[dict[str, str]]) -> dict[str, dict[str, float]]:
    normalization = {}

    for feature in NUMERIC_FEATURES:
        values = [float(row[feature]) for row in rows]
        mean = sum(values) / len(values)
        variance = sum((value - mean) ** 2 for value in values) / len(values)
        normalization[feature] = {"mean": mean, "std": math.sqrt(variance)}

    return normalization


def _feature_vector(
    row: dict[str, str], normalization: dict[str, dict[str, float]]
) -> dict[str, float]:
    vector = {}

    for feature in NUMERIC_FEATURES:
        stats = normalization[feature]
        vector[feature] = (float(row[feature]) - stats["mean"]) / stats["std"]

    contract_type = row["contract_type"]
    vector["contract_month_to_month"] = float(contract_type == "month_to_month")
    vector["contract_one_year"] = float(contract_type == "one_year")
    vector["contract_two_year"] = float(contract_type == "two_year")

    return vector


if __name__ == "__main__":
    path = save_model(train_model())
    print(f"Saved model artifact to {path}")

