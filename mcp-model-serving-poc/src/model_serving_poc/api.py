import os
from typing import Annotated, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, status
from pydantic import BaseModel, Field

from model_serving_poc.contracts import PredictionRequest
from model_serving_poc.model import ChurnModel


API_KEY = os.getenv("MODEL_API_KEY", "dev-api-key")
app = FastAPI(title="MCP Model Serving POC", version="1.0.0")
model = ChurnModel.load()


class PredictionRequestSchema(BaseModel):
    tenure_months: int = Field(ge=0, le=120)
    monthly_charges: float = Field(ge=0, le=500)
    support_tickets: int = Field(ge=0, le=50)
    contract_type: str


class PredictionResponseSchema(BaseModel):
    model_name: str
    model_version: str
    churn_probability: float
    prediction: str


def require_api_key(x_api_key: Annotated[Optional[str], Header()] = None) -> None:
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API key",
        )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": model.model_version}


@app.post(
    "/v1/predict",
    response_model=PredictionResponseSchema,
    dependencies=[Depends(require_api_key)],
)
def predict(request: PredictionRequestSchema) -> PredictionResponseSchema:
    response = model.predict(
        PredictionRequest(
            tenure_months=request.tenure_months,
            monthly_charges=request.monthly_charges,
            support_tickets=request.support_tickets,
            contract_type=request.contract_type,
        )
    )
    return PredictionResponseSchema(**response.__dict__)
