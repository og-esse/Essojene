from model_serving_poc.contracts import PredictionRequest
from model_serving_poc.model import ChurnModel


def test_predicts_higher_risk_for_month_to_month_customer() -> None:
    model = ChurnModel.load()

    response = model.predict(
        PredictionRequest(
            tenure_months=5,
            monthly_charges=95.0,
            support_tickets=5,
            contract_type="month_to_month",
        )
    )

    assert response.prediction == "likely_to_churn"
    assert response.churn_probability > 0.8


def test_predicts_lower_risk_for_stable_two_year_customer() -> None:
    model = ChurnModel.load()

    response = model.predict(
        PredictionRequest(
            tenure_months=60,
            monthly_charges=50.0,
            support_tickets=0,
            contract_type="two_year",
        )
    )

    assert response.prediction == "likely_to_stay"
    assert response.churn_probability < 0.2

