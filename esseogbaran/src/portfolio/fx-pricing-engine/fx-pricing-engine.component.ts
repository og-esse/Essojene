import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fx-pricing-engine',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fx-pricing-engine.component.html',
  styleUrls: ['./fx-pricing-engine.component.scss'],
})
export class FxPricingEngineComponent {
  highlights = [
    'Framed electronic quote setting as a supervised fill-probability problem followed by expected-value optimization.',
    'Built a deterministic 50,000-RFQ training pipeline using spread, notional, volatility, liquidity, order-book imbalance, client tier, and trade side.',
    'Compared calibrated logistic regression and histogram gradient boosting using held-out log loss, ROC-AUC, Brier score, and calibration error.',
    'Searches candidate spreads from 0.4 to 3.0 pips and recommends the quote that maximizes expected P&L after adverse-selection cost.',
  ];

  productionHighlights = [
    'Serves typed quote recommendations and model metrics through versioned FastAPI endpoints.',
    'Captures accepts, rejects, and trader overrides in an append-only SQLite audit trail for feedback analysis.',
    'Packages the service with Docker and validates pricing behavior through pytest and backtesting.',
  ];

  stack = [
    'Python',
    'scikit-learn',
    'FastAPI',
    'Pydantic',
    'NumPy',
    'SQLite',
    'Docker',
    'pytest',
  ];

  projectFacts = [
    { value: '50,000', label: 'Synthetic RFQs' },
    { value: '0.4-3.0', label: 'Spread search (pips)' },
    { value: '/v1/quote', label: 'Typed pricing API' },
  ];

  sampleRows = [
    { spread: '0.6 pips', fill: '90%', pnl: '$118' },
    { spread: '1.2 pips', fill: '79%', pnl: '$222' },
    { spread: '1.8 pips', fill: '62%', pnl: '$266' },
    { spread: '2.4 pips', fill: '42%', pnl: '$244' },
  ];
}
