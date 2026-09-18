from dataclasses import dataclass


VALID_CURRENCY_PAIRS = {"EUR/USD", "USD/CAD", "GBP/USD"}
VALID_SIDES = {"buy", "sell"}
VALID_CLIENT_TIERS = {1, 2, 3}


@dataclass(frozen=True)
class QuoteRequest:
    currency_pair: str
    side: str
    notional_millions: float
    volatility_bps: float
    liquidity_score: float
    order_book_imbalance: float
    client_tier: int
    validity_seconds: int = 60

    def __post_init__(self) -> None:
        if self.currency_pair not in VALID_CURRENCY_PAIRS:
            raise ValueError("currency_pair must be EUR/USD, USD/CAD, or GBP/USD")
        if self.side not in VALID_SIDES:
            raise ValueError("side must be buy or sell")
        if not 0.1 <= self.notional_millions <= 100:
            raise ValueError("notional_millions must be between 0.1 and 100")
        if not 0 <= self.volatility_bps <= 50:
            raise ValueError("volatility_bps must be between 0 and 50")
        if not 0 <= self.liquidity_score <= 1:
            raise ValueError("liquidity_score must be between 0 and 1")
        if not -1 <= self.order_book_imbalance <= 1:
            raise ValueError("order_book_imbalance must be between -1 and 1")
        if self.client_tier not in VALID_CLIENT_TIERS:
            raise ValueError("client_tier must be 1, 2, or 3")
        if not 5 <= self.validity_seconds <= 300:
            raise ValueError("validity_seconds must be between 5 and 300")


@dataclass(frozen=True)
class QuoteCandidate:
    spread_pips: float
    bid: float
    ask: float
    fill_probability: float
    expected_pnl_usd: float


@dataclass(frozen=True)
class QuoteResponse:
    model_name: str
    model_version: str
    currency_pair: str
    mid: float
    recommended_bid: float
    recommended_ask: float
    spread_pips: float
    fill_probability: float
    expected_pnl_usd: float
    candidates: list[QuoteCandidate]
