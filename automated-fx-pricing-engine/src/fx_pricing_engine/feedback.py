from __future__ import annotations

import json
import os
import sqlite3
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fx_pricing_engine.contracts import QuoteRequest, QuoteResponse


DEFAULT_DB_PATH = Path(os.getenv("FX_FEEDBACK_DB", "/tmp/fx_quote_feedback.sqlite3"))
OVERRIDE_REASONS = {
    "client_relationship",
    "competitive_pricing",
    "market_movement",
    "inventory_or_risk_constraint",
    "low_model_confidence",
    "other",
}
OUTCOMES = {"accepted", "rejected", "override"}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class FeedbackStore:
    def __init__(self, db_path: Path | str = DEFAULT_DB_PATH) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS quotes (
                    quote_id TEXT PRIMARY KEY,
                    created_at TEXT NOT NULL,
                    model_name TEXT NOT NULL,
                    model_version TEXT NOT NULL,
                    request_json TEXT NOT NULL,
                    response_json TEXT NOT NULL,
                    currency_pair TEXT NOT NULL,
                    side TEXT NOT NULL,
                    client_tier INTEGER NOT NULL,
                    recommended_spread_pips REAL NOT NULL,
                    fill_probability REAL NOT NULL,
                    expected_pnl_usd REAL NOT NULL
                );

                CREATE TABLE IF NOT EXISTS quote_outcomes (
                    event_id TEXT PRIMARY KEY,
                    quote_id TEXT NOT NULL REFERENCES quotes(quote_id),
                    created_at TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    final_spread_pips REAL,
                    overridden INTEGER NOT NULL,
                    override_reason TEXT,
                    note TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
                CREATE INDEX IF NOT EXISTS idx_quote_outcomes_quote_id_created_at
                    ON quote_outcomes(quote_id, created_at);
                """
            )

    def record_quote(self, request: QuoteRequest, response: QuoteResponse) -> dict[str, Any]:
        quote_id = f"quote_{uuid4().hex}"
        created_at = utc_now()
        request_json = json.dumps(asdict(request), sort_keys=True)
        response_json = json.dumps(
            {
                **asdict(response),
                "candidates": [asdict(candidate) for candidate in response.candidates],
            },
            sort_keys=True,
        )

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO quotes (
                    quote_id, created_at, model_name, model_version, request_json,
                    response_json, currency_pair, side, client_tier,
                    recommended_spread_pips, fill_probability, expected_pnl_usd
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    quote_id,
                    created_at,
                    response.model_name,
                    response.model_version,
                    request_json,
                    response_json,
                    request.currency_pair,
                    request.side,
                    request.client_tier,
                    response.spread_pips,
                    response.fill_probability,
                    response.expected_pnl_usd,
                ),
            )

        return {
            "quote_id": quote_id,
            "created_at": created_at,
            **json.loads(response_json),
        }

    def record_outcome(
        self,
        quote_id: str,
        outcome: str,
        final_spread_pips: float | None = None,
        override_reason: str | None = None,
        note: str | None = None,
    ) -> dict[str, Any]:
        if outcome not in OUTCOMES:
            raise ValueError("outcome must be accepted, rejected, or override")
        if outcome == "override":
            if final_spread_pips is None:
                raise ValueError("final_spread_pips is required for overrides")
            if override_reason not in OVERRIDE_REASONS:
                raise ValueError("override_reason is required for overrides")
        elif override_reason is not None:
            raise ValueError("override_reason is only valid for overrides")

        with self._connect() as connection:
            quote = connection.execute(
                "SELECT quote_id FROM quotes WHERE quote_id = ?",
                (quote_id,),
            ).fetchone()
            if quote is None:
                raise KeyError(quote_id)

            event = {
                "event_id": f"event_{uuid4().hex}",
                "quote_id": quote_id,
                "created_at": utc_now(),
                "outcome": outcome,
                "final_spread_pips": final_spread_pips,
                "overridden": outcome == "override",
                "override_reason": override_reason,
                "note": note,
            }
            connection.execute(
                """
                INSERT INTO quote_outcomes (
                    event_id, quote_id, created_at, outcome, final_spread_pips,
                    overridden, override_reason, note
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    event["event_id"],
                    event["quote_id"],
                    event["created_at"],
                    event["outcome"],
                    event["final_spread_pips"],
                    int(event["overridden"]),
                    event["override_reason"],
                    event["note"],
                ),
            )

        return event

    def summary(self) -> dict[str, Any]:
        with self._connect() as connection:
            quote_rows = connection.execute(
                """
                SELECT quote_id, currency_pair, client_tier, model_version,
                       recommended_spread_pips, fill_probability, expected_pnl_usd
                FROM quotes
                """
            ).fetchall()
            latest_outcome_rows = connection.execute(
                """
                SELECT outcome.*
                FROM quote_outcomes outcome
                JOIN (
                    SELECT quote_id, MAX(created_at) AS created_at
                    FROM quote_outcomes
                    GROUP BY quote_id
                ) latest
                    ON latest.quote_id = outcome.quote_id
                    AND latest.created_at = outcome.created_at
                """
            ).fetchall()

        outcomes_by_quote = {row["quote_id"]: dict(row) for row in latest_outcome_rows}
        quotes = [dict(row) for row in quote_rows]
        decided = [quote for quote in quotes if quote["quote_id"] in outcomes_by_quote]
        accepted = [
            quote
            for quote in decided
            if outcomes_by_quote[quote["quote_id"]]["outcome"] == "accepted"
        ]
        overridden = [
            quote
            for quote in decided
            if outcomes_by_quote[quote["quote_id"]]["outcome"] == "override"
        ]

        def rate(count: int, denominator: int) -> float:
            return round(count / denominator, 4) if denominator else 0

        return {
            "quote_count": len(quotes),
            "decision_count": len(decided),
            "acceptance_rate": rate(len(accepted), len(decided)),
            "override_rate": rate(len(overridden), len(decided)),
            "average_recommended_spread_pips": self._average(
                quote["recommended_spread_pips"] for quote in quotes
            ),
            "average_final_spread_pips": self._average(
                outcomes_by_quote[quote["quote_id"]]["final_spread_pips"]
                for quote in decided
                if outcomes_by_quote[quote["quote_id"]]["final_spread_pips"] is not None
            ),
            "by_client_tier": self._group_decisions(decided, outcomes_by_quote, "client_tier"),
            "by_currency_pair": self._group_decisions(decided, outcomes_by_quote, "currency_pair"),
            "by_model_version": self._group_decisions(decided, outcomes_by_quote, "model_version"),
            "override_reasons": self._override_reasons(latest_outcome_rows),
        }

    def _group_decisions(
        self,
        quotes: list[dict[str, Any]],
        outcomes_by_quote: dict[str, dict[str, Any]],
        key: str,
    ) -> list[dict[str, Any]]:
        groups: dict[str, dict[str, int]] = {}
        for quote in quotes:
            group = groups.setdefault(
                str(quote[key]),
                {"decision_count": 0, "accepted_count": 0, "override_count": 0},
            )
            outcome = outcomes_by_quote[quote["quote_id"]]["outcome"]
            group["decision_count"] += 1
            group["accepted_count"] += int(outcome == "accepted")
            group["override_count"] += int(outcome == "override")

        return [
            {
                key: group_key,
                **counts,
                "acceptance_rate": round(
                    counts["accepted_count"] / counts["decision_count"], 4
                ),
                "override_rate": round(
                    counts["override_count"] / counts["decision_count"], 4
                ),
            }
            for group_key, counts in sorted(groups.items())
        ]

    def _override_reasons(self, outcome_rows: list[sqlite3.Row]) -> list[dict[str, Any]]:
        reason_counts: dict[str, int] = {}
        for row in outcome_rows:
            reason = row["override_reason"]
            if reason:
                reason_counts[reason] = reason_counts.get(reason, 0) + 1
        return [
            {"reason": reason, "count": count}
            for reason, count in sorted(reason_counts.items(), key=lambda item: (-item[1], item[0]))
        ]

    def _average(self, values: Any) -> float | None:
        numbers = [float(value) for value in values]
        if not numbers:
            return None
        return round(sum(numbers) / len(numbers), 4)
