# MCP Model Serving POC

A small Python project that serves a trained churn-risk model through two contracts:

- a versioned FastAPI endpoint with API-key authentication
- an MCP server exposing the same model as a `predict_churn` tool

The model is intentionally small so the full flow is easy to review: train from CSV, save a model artifact, load it in a serving layer, validate requests, and expose the prediction contract to an MCP-compatible client.

## What It Demonstrates

- Python model-serving structure
- MCP tool design
- API contract design with versioning
- API-key authentication
- Portable model artifact loading
- Databricks integration path without overstating production Databricks experience

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
python -m model_serving_poc.train
pytest
uvicorn model_serving_poc.api:app --reload
```

Call the versioned API:

```bash
curl -X POST http://127.0.0.1:8000/v1/predict \
  -H "content-type: application/json" \
  -H "x-api-key: dev-api-key" \
  -d '{
    "tenure_months": 8,
    "monthly_charges": 89.5,
    "support_tickets": 4,
    "contract_type": "month_to_month"
  }'
```

Run the MCP server:

```bash
python -m model_serving_poc.mcp_server
```

Inspect it:

```bash
npx @modelcontextprotocol/inspector python -m model_serving_poc.mcp_server
```

## Databricks Touchpoint

The honest Databricks path is:

1. Train the same model in Databricks Community Edition using the data in `data/churn_training.csv`.
2. Export the generated `model.json` artifact.
3. Replace `artifacts/model.json` in this project with the Databricks-trained artifact.
4. Keep the FastAPI and MCP serving contracts unchanged.

That supports the interview line: "I served a Databricks-trained model through a custom MCP tool." Only use that line after you actually run the training notebook/export in Databricks.

