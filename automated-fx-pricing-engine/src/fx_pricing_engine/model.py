from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from fx_pricing_engine.contracts import QuoteCandidate, QuoteRequest, QuoteResponse


DEFAULT_MODEL_PATH = Path(__file__).resolve().parent / "artifacts" / "fill_model.json"


@dataclass(frozen=True)
class FxPricingModel:
    model_name: str
    model_version: str
    base_mid_by_pair: dict[str, float]
    weights: dict[str, float]

    @classmethod
    def load(cls, model_path: Path | str = DEFAULT_MODEL_PATH) -> "FxPricingModel":
        with Path(model_path).open() as model_file:
            raw_model = json.load(model_file)

        return cls(
            model_name=raw_model["model_name"],
            model_version=raw_model["model_version"],
            base_mid_by_pair={
                pair: float(mid) for pair, mid in raw_model["base_mid_by_pair"].items()
            },
            weights={key: float(value) for key, value in raw_model["weights"].items()},
        )

    def recommend_quote(self, request: QuoteRequest) -> QuoteResponse:
        candidates = [
            self._candidate(request, spread_pips / 10)
            for spread_pips in range(4, 31, 2)
        ]
        best_candidate = max(candidates, key=lambda quote: quote.expected_pnl_usd)

        return QuoteResponse(
            model_name=self.model_name,
            model_version=self.model_version,
            currency_pair=request.currency_pair,
            mid=self._mid(request),
            recommended_bid=best_candidate.bid,
            recommended_ask=best_candidate.ask,
            spread_pips=best_candidate.spread_pips,
            fill_probability=best_candidate.fill_probability,
            expected_pnl_usd=best_candidate.expected_pnl_usd,
            candidates=candidates,
        )

    def fill_probability(self, request: QuoteRequest, spread_pips: float) -> float:
        score = self.weights["bias"]
        score += self.weights["spread_pips"] * spread_pips
        score += self.weights["notional_millions"] * request.notional_millions
        score += self.weights["volatility_bps"] * request.volatility_bps
        score += self.weights["liquidity_score"] * request.liquidity_score
        score += self.weights["order_book_imbalance"] * request.order_book_imbalance
        score += self.weights["client_tier_1"] * float(request.client_tier == 1)
        score += self.weights["client_tier_2"] * float(request.client_tier == 2)
        score += self.weights["side_buy"] * float(request.side == "buy")

        return 1 / (1 + math.exp(-score))

    def _candidate(self, request: QuoteRequest, spread_pips: float) -> QuoteCandidate:
        mid = self._mid(request)
        half_spread = self._pip_value(request.currency_pair) * spread_pips / 2
        fill_probability = self.fill_probability(request, spread_pips)
        expected_pnl_usd = self._expected_pnl_usd(
            request=request,
            spread_pips=spread_pips,
            fill_probability=fill_probability,
        )

        return QuoteCandidate(
            spread_pips=round(spread_pips, 2),
            bid=round(mid - half_spread, 5),
            ask=round(mid + half_spread, 5),
            fill_probability=round(fill_probability, 4),
            expected_pnl_usd=round(expected_pnl_usd, 2),
        )

    def _mid(self, request: QuoteRequest) -> float:
        pair_mid = self.base_mid_by_pair[request.currency_pair]
        liquidity_adjustment = (0.5 - request.liquidity_score) * self._pip_value(
            request.currency_pair
        )
        imbalance_adjustment = request.order_book_imbalance * self._pip_value(
            request.currency_pair
        )
        side_adjustment = 0.25 * self._pip_value(request.currency_pair)
        if request.side == "sell":
            side_adjustment *= -1

        return round(pair_mid + liquidity_adjustment + imbalance_adjustment + side_adjustment, 5)

    def _expected_pnl_usd(
        self,
        request: QuoteRequest,
        spread_pips: float,
        fill_probability: float,
    ) -> float:
        notional = request.notional_millions * 1_000_000
        gross_edge = notional * self._pip_value(request.currency_pair) * spread_pips / 2
        adverse_selection_cost = (
            notional
            * self._pip_value(request.currency_pair)
            * request.volatility_bps
            * (1 - request.liquidity_score)
            * 0.08
        )
        return (gross_edge - adverse_selection_cost) * fill_probability

    def _pip_value(self, currency_pair: str) -> float:
        return 0.0001 if currency_pair != "USD/JPY" else 0.01
