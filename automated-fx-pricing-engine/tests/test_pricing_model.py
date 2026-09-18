from fx_pricing_engine.contracts import QuoteRequest
from fx_pricing_engine.model import FxPricingModel


def test_fill_probability_drops_as_spread_widens() -> None:
    model = FxPricingModel.load()
    request = QuoteRequest(
        currency_pair="EUR/USD",
        side="buy",
        notional_millions=5,
        volatility_bps=4,
        liquidity_score=0.8,
        order_book_imbalance=0.1,
        client_tier=1,
    )

    tight_probability = model.fill_probability(request, spread_pips=0.6)
    wide_probability = model.fill_probability(request, spread_pips=2.4)

    assert tight_probability > wide_probability


def test_recommend_quote_balances_fill_probability_and_expected_pnl() -> None:
    model = FxPricingModel.load()
    request = QuoteRequest(
        currency_pair="EUR/USD",
        side="buy",
        notional_millions=5,
        volatility_bps=3,
        liquidity_score=0.85,
        order_book_imbalance=0.05,
        client_tier=1,
    )

    response = model.recommend_quote(request)
    expected_pnls = [candidate.expected_pnl_usd for candidate in response.candidates]

    assert response.expected_pnl_usd == max(expected_pnls)
    assert response.recommended_bid < response.mid < response.recommended_ask
    assert 0 < response.fill_probability < 1
