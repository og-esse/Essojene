from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from fx_pricing_engine.contracts import QuoteRequest
from fx_pricing_engine.model import FxPricingModel


app = FastAPI(title="Automated FX Pricing Engine", version="1.0.0")
model = FxPricingModel.load()
STATIC_DIR = Path(__file__).resolve().parent / "static"


class QuoteRequestSchema(BaseModel):
    currency_pair: str = "EUR/USD"
    side: str = "buy"
    notional_millions: float = Field(ge=0.1, le=100)
    volatility_bps: float = Field(ge=0, le=50)
    liquidity_score: float = Field(ge=0, le=1)
    order_book_imbalance: float = Field(ge=-1, le=1)
    client_tier: int = Field(ge=1, le=3)
    validity_seconds: int = Field(default=60, ge=5, le=300)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": model.model_version}


@app.post("/v1/quote")
def quote(request: QuoteRequestSchema) -> dict:
    response = model.recommend_quote(
        QuoteRequest(
            currency_pair=request.currency_pair,
            side=request.side,
            notional_millions=request.notional_millions,
            volatility_bps=request.volatility_bps,
            liquidity_score=request.liquidity_score,
            order_book_imbalance=request.order_book_imbalance,
            client_tier=request.client_tier,
            validity_seconds=request.validity_seconds,
        )
    )
    return {
        **response.__dict__,
        "candidates": [candidate.__dict__ for candidate in response.candidates],
    }


@app.get("/", include_in_schema=False)
def workstation() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
