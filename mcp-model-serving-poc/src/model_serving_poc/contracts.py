from dataclasses import dataclass


ContractType = str

VALID_CONTRACT_TYPES = {"month_to_month", "one_year", "two_year"}


@dataclass(frozen=True)
class PredictionRequest:
    tenure_months: int
    monthly_charges: float
    support_tickets: int
    contract_type: ContractType

    def __post_init__(self) -> None:
        if not 0 <= self.tenure_months <= 120:
            raise ValueError("tenure_months must be between 0 and 120")
        if not 0 <= self.monthly_charges <= 500:
            raise ValueError("monthly_charges must be between 0 and 500")
        if not 0 <= self.support_tickets <= 50:
            raise ValueError("support_tickets must be between 0 and 50")
        if self.contract_type not in VALID_CONTRACT_TYPES:
            raise ValueError(
                "contract_type must be month_to_month, one_year, or two_year"
            )


@dataclass(frozen=True)
class PredictionResponse:
    model_name: str
    model_version: str
    churn_probability: float
    prediction: str
