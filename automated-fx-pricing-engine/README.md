# Automated FX Pricing Engine

A Python proof of concept for quote optimization on an electronic FX desk. The engine takes a simplified request for quote, uses a trained classifier to predict the probability that a client accepts different spreads, and recommends the quote that maximizes expected P&L.

The project includes a reproducible synthetic RFQ generator, calibrated model comparison, held-out evaluation, pricing backtest, versioned model artifact, typed serving contract, and desk-facing UI. Synthetic data and limitations are documented explicitly in [MODEL_CARD.md](MODEL_CARD.md).

## What It Demonstrates

- FX pricing and market microstructure concepts
- Fill-probability modeling
- Scikit-learn training and probability calibration
- Held-out model evaluation and pricing-strategy backtesting
- Expected-value optimization
- Python production structure
- FastAPI serving contract
- Business-facing decision output

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
pytest
uvicorn fx_pricing_engine.api:app --reload
```

Open `http://127.0.0.1:8000` for the desk-facing pricing workstation. It includes
an RFQ ticket, recommended bid/ask, model metrics, the spread optimization curve,
and an in-session quote blotter.

Call the quote API:

```bash
curl -X POST http://127.0.0.1:8000/v1/quote \
  -H "content-type: application/json" \
  -d '{
    "currency_pair": "EUR/USD",
    "side": "buy",
    "notional_millions": 5,
    "volatility_bps": 3,
    "liquidity_score": 0.85,
    "order_book_imbalance": 0.05,
    "client_tier": 1,
    "validity_seconds": 60
  }'
```

Example output:

```json
{
  "currency_pair": "EUR/USD",
  "mid": 1.1724,
  "recommended_bid": 1.17231,
  "recommended_ask": 1.17249,
  "spread_pips": 1.8,
  "fill_probability": 0.6154,
  "expected_pnl_usd": 265.85
}
```

Inspect the deployed model's evaluation report:

```bash
curl http://127.0.0.1:8000/v1/model/metrics
```

## Quote Decision Feedback

The workstation now records model-generated quotes and trader decisions in a local
SQLite audit trail. By default the database is written to
`/tmp/fx_quote_feedback.sqlite3`; set `FX_FEEDBACK_DB` to point at a different
SQLite file for local development.

```bash
curl -X POST http://127.0.0.1:8000/v1/quotes \
  -H "content-type: application/json" \
  -d '{
    "currency_pair": "EUR/USD",
    "side": "buy",
    "notional_millions": 5,
    "volatility_bps": 3,
    "liquidity_score": 0.85,
    "order_book_imbalance": 0.05,
    "client_tier": 1,
    "validity_seconds": 60
  }'

curl -X POST http://127.0.0.1:8000/v1/quotes/{quote_id}/outcome \
  -H "content-type: application/json" \
  -d '{
    "outcome": "override",
    "final_spread_pips": 1.6,
    "override_reason": "competitive_pricing"
  }'

curl http://127.0.0.1:8000/v1/feedback/summary
```

Outcome events are append-only so changed decisions leave an audit trail. The
dashboard reports acceptance, override, spread-comparison, client-tier,
currency-pair, model-version, and override-reason metrics. It intentionally
reports expected P&L only; realized P&L should be added later when post-trade
market data is available.

## Train the Model

Reproduce the packaged model and metrics with a deterministic 50,000-RFQ synthetic
dataset:

```bash
train-fx-model --samples 50000
```

The pipeline compares calibrated logistic regression with monotonic histogram
gradient boosting. It selects the model with the lowest validation log loss, then
reports ROC-AUC, log loss, Brier score, expected calibration error, and held-out
test performance. It also compares model-optimized spreads with a fixed 1-pip
baseline and the synthetic oracle.

## Modeling Notes

The deployed fill model is a calibrated histogram gradient-boosted classifier over
quote and market features:

- quoted spread
- notional size
- short-horizon volatility
- liquidity score
- order-book imbalance
- client tier
- buy/sell side

The optimizer searches candidate spreads from 0.4 to 3.0 pips and selects the quote with the highest expected P&L after a simple adverse-selection cost adjustment.

The committed model was trained only on synthetic data. Its metrics demonstrate a
sound ML workflow and internally consistent pricing behavior, not live-market alpha.

## Production Checks

Build and run the same containerized service locally:

```bash
docker build -t fx-pricing-engine .
docker run --rm -p 8000:8000 fx-pricing-engine
```

The image runs as a non-root user and includes an application health check. GitHub
Actions runs the test suite and a 5,000-row training smoke test on each project
change.
