# Automated FX Pricing Engine

A Python proof of concept for quote optimization on an electronic FX desk. The engine takes a simplified request for quote, predicts the probability that a client accepts different spreads, and recommends the quote that maximizes expected P&L.

The model is intentionally transparent for portfolio review: coefficients live in `src/fx_pricing_engine/artifacts/fill_model.json`, the serving contract is typed, and tests cover the core pricing behavior.

## What It Demonstrates

- FX pricing and market microstructure concepts
- Fill-probability modeling
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

## Modeling Notes

The fill model is a logistic scoring function over quote and market features:

- quoted spread
- notional size
- short-horizon volatility
- liquidity score
- order-book imbalance
- client tier
- buy/sell side

The optimizer searches candidate spreads from 0.4 to 3.0 pips and selects the quote with the highest expected P&L after a simple adverse-selection cost adjustment.
