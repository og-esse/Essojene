from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from model_serving_poc.contracts import PredictionRequest, PredictionResponse


DEFAULT_MODEL_PATH = Path(__file__).resolve().parents[2] / "artifacts" / "model.json"


@dataclass(frozen=True)
class ChurnModel:
    model_name: str
    model_version: str
    threshold: float
    weights: dict[str, float]
    normalization: dict[str, dict[str, float]]

    @classmethod
    def load(cls, model_path: Path | str = DEFAULT_MODEL_PATH) -> "ChurnModel":
        with Path(model_path).open() as model_file:
            raw_model = json.load(model_file)

        return cls(
            model_name=raw_model["model_name"],
            model_version=raw_model["model_version"],
            threshold=float(raw_model["threshold"]),
            weights={key: float(value) for key, value in raw_model["weights"].items()},
            normalization=raw_model["normalization"],
        )

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        features = self._features(request)
        score = self.weights["bias"]

        for feature_name, feature_value in features.items():
            score += self.weights[feature_name] * feature_value

        probability = 1 / (1 + math.exp(-score))
        prediction = (
            "likely_to_churn" if probability >= self.threshold else "likely_to_stay"
        )

        return PredictionResponse(
            model_name=self.model_name,
            model_version=self.model_version,
            churn_probability=round(probability, 4),
            prediction=prediction,
        )

    def _features(self, request: PredictionRequest) -> dict[str, float]:
        return {
            "tenure_months": self._normalize("tenure_months", request.tenure_months),
            "monthly_charges": self._normalize(
                "monthly_charges", request.monthly_charges
            ),
            "support_tickets": self._normalize(
                "support_tickets", request.support_tickets
            ),
            "contract_month_to_month": float(
                request.contract_type == "month_to_month"
            ),
            "contract_one_year": float(request.contract_type == "one_year"),
            "contract_two_year": float(request.contract_type == "two_year"),
        }

    def _normalize(self, feature_name: str, value: float) -> float:
        stats = self.normalization[feature_name]
        return (value - stats["mean"]) / stats["std"]

