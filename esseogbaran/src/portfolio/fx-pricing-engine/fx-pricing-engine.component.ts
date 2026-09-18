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
    'Prices an RFQ using mid-market, spread, notional, volatility, liquidity, order-book imbalance, and client tier inputs.',
    'Predicts quote acceptance probability for each candidate spread.',
    'Optimizes the quote by maximizing expected P&L after adverse-selection cost.',
    'Serves the pricing workflow through a versioned FastAPI endpoint.',
  ];

  stack = ['Python', 'FastAPI', 'Quant', 'ML', 'Optimization'];

  sampleRows = [
    { spread: '0.6 pips', fill: '90%', pnl: '$118' },
    { spread: '1.2 pips', fill: '79%', pnl: '$222' },
    { spread: '1.8 pips', fill: '62%', pnl: '$266' },
    { spread: '2.4 pips', fill: '42%', pnl: '$244' },
  ];
}
