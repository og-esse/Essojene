from __future__ import annotations

from dataclasses import asdict

from mcp.server.fastmcp import FastMCP

from model_serving_poc.contracts import PredictionRequest
from model_serving_poc.model import ChurnModel


mcp = FastMCP("mcp-model-serving-poc")
model = ChurnModel.load()


@mcp.tool()
def predict_churn(
    tenure_months: int,
    monthly_charges: float,
    support_tickets: int,
    contract_type: str,
) -> dict:
    """Predict customer churn risk using the loaded model artifact."""
    request = PredictionRequest(
        tenure_months=tenure_months,
        monthly_charges=monthly_charges,
        support_tickets=support_tickets,
        contract_type=contract_type,
    )
    return asdict(model.predict(request))


if __name__ == "__main__":
    mcp.run()

