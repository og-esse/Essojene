from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from fx_pricing_engine.contracts import QuoteRequest
from fx_pricing_engine.feedback import FeedbackStore, OVERRIDE_REASONS
from fx_pricing_engine.model import FxPricingModel


app = FastAPI(title="Automated FX Pricing Engine", version="1.0.0")
model = FxPricingModel.load()
feedback_store = FeedbackStore()
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


class QuoteOutcomeSchema(BaseModel):
    outcome: str
    final_spread_pips: Optional[float] = Field(default=None, ge=0)
    override_reason: Optional[str] = None
    note: Optional[str] = Field(default=None, max_length=500)


def quote_request_from_schema(request: QuoteRequestSchema) -> QuoteRequest:
    return QuoteRequest(
        currency_pair=request.currency_pair,
        side=request.side,
        notional_millions=request.notional_millions,
        volatility_bps=request.volatility_bps,
        liquidity_score=request.liquidity_score,
        order_book_imbalance=request.order_book_imbalance,
        client_tier=request.client_tier,
        validity_seconds=request.validity_seconds,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "model_name": model.model_name,
        "model_version": model.model_version,
    }


@app.get("/v1/model/metrics")
def model_metrics() -> dict:
    return model.report


@app.post("/v1/quote")
def quote(request: QuoteRequestSchema) -> dict:
    response = model.recommend_quote(quote_request_from_schema(request))
    return {
        **response.__dict__,
        "candidates": [candidate.__dict__ for candidate in response.candidates],
    }


@app.post("/v1/quotes")
def create_quote(request: QuoteRequestSchema) -> dict:
    quote_request = quote_request_from_schema(request)
    response = model.recommend_quote(quote_request)
    return feedback_store.record_quote(quote_request, response)


@app.post("/v1/quotes/{quote_id}/outcome")
def record_quote_outcome(quote_id: str, decision: QuoteOutcomeSchema) -> dict:
    try:
        return feedback_store.record_outcome(
            quote_id=quote_id,
            outcome=decision.outcome,
            final_spread_pips=decision.final_spread_pips,
            override_reason=decision.override_reason,
            note=decision.note,
        )
    except KeyError as error:
        raise HTTPException(status_code=404, detail="quote_id not found") from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.get("/v1/feedback/summary")
def feedback_summary() -> dict:
    return {
        **feedback_store.summary(),
        "override_reasons_allowed": sorted(OVERRIDE_REASONS),
    }


@app.get("/", include_in_schema=False)
def workstation() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
