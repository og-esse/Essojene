import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.scss'],
})
export class PortfolioCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() tags: string[] = [];
  @Input() imageUrl = '';
  @Input() githubUrl = '';
  @Input() liveUrl = '';
  @Input() id = '';
  @Input() link = '';

  get hasProjectLink(): boolean {
    return !!this.link && this.link !== '#';
  }

  get isInternalLink(): boolean {
    return this.hasProjectLink && this.link.startsWith('/');
  }
}
