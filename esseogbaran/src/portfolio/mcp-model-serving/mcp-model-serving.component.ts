import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mcp-model-serving',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mcp-model-serving.component.html',
  styleUrls: ['./mcp-model-serving.component.scss'],
})
export class McpModelServingComponent {
  highlights = [
    'Trains a small churn-risk model from CSV and saves it as a portable JSON artifact.',
    'Serves predictions through a versioned FastAPI contract at /v1/predict.',
    'Protects the API with x-api-key authentication for a realistic service boundary.',
    'Exposes the same scoring logic through an MCP predict_churn tool.',
  ];

  stack = ['Python', 'FastAPI', 'MCP', 'Model Serving', 'API Auth'];
}

