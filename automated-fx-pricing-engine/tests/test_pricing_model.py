from fx_pricing_engine import api
from fx_pricing_engine.contracts import QuoteRequest
from fx_pricing_engine.feedback import FeedbackStore
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


def test_serving_uses_evaluated_trained_artifact() -> None:
    model = FxPricingModel.load()

    assert model.model_name == "synthetic_fx_hist_gradient_boosting"
    assert model.report["selected_model"] == "hist_gradient_boosting"
    assert model.report["training_samples"] == 50_000
    assert model.report["test_metrics"]["hist_gradient_boosting"]["roc_auc"] > 0.75
    assert model.report["backtest"]["model_uplift_vs_fixed_pct"] > 0


def test_feedback_store_records_quotes_and_append_only_outcomes(tmp_path) -> None:
    store = FeedbackStore(tmp_path / "feedback.sqlite3")
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
    quote = store.record_quote(request, model.recommend_quote(request))

    accepted = store.record_outcome(
        quote["quote_id"],
        outcome="accepted",
        final_spread_pips=quote["spread_pips"],
    )
    override = store.record_outcome(
        quote["quote_id"],
        outcome="override",
        final_spread_pips=quote["spread_pips"] - 0.2,
        override_reason="competitive_pricing",
    )
    summary = store.summary()

    assert accepted["event_id"] != override["event_id"]
    assert summary["quote_count"] == 1
    assert summary["decision_count"] == 1
    assert summary["override_rate"] == 1
    assert summary["average_final_spread_pips"] == round(quote["spread_pips"] - 0.2, 4)
    assert summary["override_reasons"] == [
        {"reason": "competitive_pricing", "count": 1}
    ]


def test_quote_feedback_endpoints_round_trip(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(api, "feedback_store", FeedbackStore(tmp_path / "api.sqlite3"))
    quote = api.create_quote(
        api.QuoteRequestSchema(
            currency_pair="EUR/USD",
            side="buy",
            notional_millions=5,
            volatility_bps=3,
            liquidity_score=0.85,
            order_book_imbalance=0.05,
            client_tier=1,
            validity_seconds=60,
        )
    )

    outcome = api.record_quote_outcome(
        quote["quote_id"],
        api.QuoteOutcomeSchema(
            outcome="override",
            final_spread_pips=quote["spread_pips"] - 0.1,
            override_reason="client_relationship",
        ),
    )
    assert outcome["quote_id"] == quote["quote_id"]

    summary = api.feedback_summary()
    assert summary["quote_count"] == 1
    assert summary["override_rate"] == 1
    assert summary["override_reasons"] == [
        {"reason": "client_relationship", "count": 1}
    ]
