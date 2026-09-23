from __future__ import annotations

import math
from collections.abc import Mapping

from fx_pricing_engine.contracts import QuoteRequest


FEATURE_NAMES = (
    "spread_pips",
    "log_notional_millions",
    "volatility_bps",
    "liquidity_score",
    "order_book_imbalance",
    "log_validity_seconds",
    "side_buy",
    "client_tier_1",
    "client_tier_2",
    "pair_eur_usd",
    "pair_gbp_usd",
)


def quote_features(request: QuoteRequest, spread_pips: float) -> list[float]:
    return feature_values(
        currency_pair=request.currency_pair,
        side=request.side,
        notional_millions=request.notional_millions,
        volatility_bps=request.volatility_bps,
        liquidity_score=request.liquidity_score,
        order_book_imbalance=request.order_book_imbalance,
        client_tier=request.client_tier,
        validity_seconds=request.validity_seconds,
        spread_pips=spread_pips,
    )


def row_features(row: Mapping[str, object]) -> list[float]:
    return feature_values(
        currency_pair=str(row["currency_pair"]),
        side=str(row["side"]),
        notional_millions=float(row["notional_millions"]),
        volatility_bps=float(row["volatility_bps"]),
        liquidity_score=float(row["liquidity_score"]),
        order_book_imbalance=float(row["order_book_imbalance"]),
        client_tier=int(row["client_tier"]),
        validity_seconds=int(row["validity_seconds"]),
        spread_pips=float(row["spread_pips"]),
    )


def feature_values(
    *,
    currency_pair: str,
    side: str,
    notional_millions: float,
    volatility_bps: float,
    liquidity_score: float,
    order_book_imbalance: float,
    client_tier: int,
    validity_seconds: int,
    spread_pips: float,
) -> list[float]:
    return [
        spread_pips,
        math.log1p(notional_millions),
        volatility_bps,
        liquidity_score,
        order_book_imbalance,
        math.log1p(validity_seconds),
        float(side == "buy"),
        float(client_tier == 1),
        float(client_tier == 2),
        float(currency_pair == "EUR/USD"),
        float(currency_pair == "GBP/USD"),
    ]
