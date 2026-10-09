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
    'Built a reproducible training pipeline using 50,000 synthetic RFQs across notional, volatility, liquidity, order-book imbalance, client tier, side, and currency pair.',
    'Compared calibrated logistic regression with monotonic histogram gradient boosting, achieving 0.789 held-out ROC-AUC and a 0.176 Brier score.',
    'Evaluates 14 candidate spreads from 0.4 to 3.0 pips, balancing fill probability, spread revenue, and adverse-selection cost.',
    'Produced a 49.3% mean expected-P&L uplift over fixed 1-pip pricing in synthetic backtesting.',
  ];

  productionHighlights = [
    'Serves typed quote recommendations and model metrics through versioned FastAPI endpoints.',
    'Captures accepts, rejects, and trader overrides in an append-only SQLite audit trail for feedback analysis.',
    'Packages the service with Docker and validates pricing behavior through automated tests, backtesting, and GitHub Actions CI.',
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
    { value: '0.789', label: 'Held-out ROC-AUC' },
    { value: '0.176', label: 'Brier score' },
    { value: '+49.3%', label: 'Mean expected-P&L uplift' },
    { value: '14', label: 'Candidate spreads' },
  ];

  sampleRows = [
    { spread: '0.6 pips', fill: '90%', pnl: '$118' },
    { spread: '1.2 pips', fill: '79%', pnl: '$222' },
    { spread: '1.8 pips', fill: '62%', pnl: '$266' },
    { spread: '2.4 pips', fill: '42%', pnl: '$244' },
  ];
}
