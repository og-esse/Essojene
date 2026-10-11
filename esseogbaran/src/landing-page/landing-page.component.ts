import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NameRingComponent } from './name-ring.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterModule, NameRingComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  readonly patternRows = Array.from({ length: 48 }, (_, i) => i);
}
