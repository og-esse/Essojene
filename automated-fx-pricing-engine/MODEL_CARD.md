# FX Fill-Probability Model Card

## Intended Use

This model estimates the probability that a client accepts an electronic FX quote
at a candidate spread. The pricing engine combines that probability with expected
edge and a simplified adverse-selection cost, then recommends the candidate spread
with the highest expected P&L.

This is a portfolio proof of concept. It is not approved for live trading or risk
management decisions.

## Training Data

The training pipeline generates 50,000 synthetic RFQs with a fixed random seed.
Features cover spread, notional, volatility, liquidity, order-book imbalance,
validity, client tier, side, and currency pair. Outcomes are sampled from a
documented nonlinear probability function in `training.py`.

The data is split sequentially into 70% training, 15% validation, and 15% test
partitions. No real client, order, or market data is used.

## Candidate Models

- Calibrated logistic regression provides the interpretable baseline.
- Calibrated histogram gradient boosting captures nonlinear feature interactions.
- Monotonic constraints encode expected directional behavior for spread, notional,
  volatility, liquidity, and validity.

The model with the lowest validation log loss is packaged for serving. The current
winner is histogram gradient boosting.

## Evaluation

The committed report is in
`src/fx_pricing_engine/artifacts/model_metrics.json`. It includes validation and
held-out test ROC-AUC, log loss, Brier score, expected calibration error, and a
pricing-strategy backtest.

Current held-out results for the selected model:

| Metric | Value |
| --- | ---: |
| ROC-AUC | 0.7893 |
| Log loss | 0.5274 |
| Brier score | 0.1763 |
| Expected calibration error | 0.0126 |

The synthetic backtest reports 49.31% higher mean expected P&L than a fixed 1-pip
strategy. This result only demonstrates behavior under the generator's assumptions;
it is not evidence of expected performance in live markets.

## Limitations

- Synthetic outcomes cannot reproduce real client behavior or regime changes.
- Reference mid-prices are static and there is no live market-data feed.
- The adverse-selection calculation is deliberately simplified.
- The backtest uses the same synthetic data-generating assumptions as training.
- Production use would require time-based validation on historical RFQs, monitoring,
  governance review, access controls, and desk-approved risk limits.

## Reproduction

```bash
train-fx-model --samples 50000
pytest
```

Training rewrites both the packaged model artifact and its evaluation report.
