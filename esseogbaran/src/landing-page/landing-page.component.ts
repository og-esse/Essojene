import { afterNextRender, Component, DestroyRef, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  readonly patternRows = Array.from({ length: 48 }, (_, i) => i);
  @ViewChild('nameSculpture') private sculpture!: ElementRef<HTMLPreElement>;
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // afterNextRender runs in the browser, keeping prerendering independent of browser APIs.
    afterNextRender(() => this.zone.runOutsideAngular(() => this.animateName()));
  }

  private animateName(): void {
    const element = this.sculpture.nativeElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const columns = 58;
    const rows = 34;
    const name = 'esséogbaran';
    let frame = 0;
    let lastPaint = -Infinity;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);

    const draw = (seconds: number): void => {
      const depth = new Float32Array(columns * rows).fill(-Infinity);
      const letters = new Array<string>(columns * rows).fill(' ');
      const tilt = .65 + seconds * .36;
      const turn = seconds * .24;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const cr = Math.cos(turn), sr = Math.sin(turn);

      // Project a rotating torus onto a character grid; every visible cell is part of the name.
      for (let around = 0; around < Math.PI * 2; around += .055) {
        for (let tube = 0; tube < Math.PI * 2; tube += .09) {
          const radius = 1.55 + .65 * Math.cos(tube);
          const x = radius * Math.cos(around);
          const y = radius * Math.sin(around);
          const z = .65 * Math.sin(tube);
          const tiltedY = y * ct - z * st;
          const tiltedZ = y * st + z * ct;
          const rotatedX = x * cr - tiltedY * sr;
          const rotatedY = x * sr + tiltedY * cr;
          const perspective = 52 / (6 - tiltedZ);
          const column = Math.round(columns / 2 + rotatedX * perspective);
          const row = Math.round(rows / 2 + rotatedY * perspective * .6);
          if (column < 0 || column >= columns || row < 0 || row >= rows) continue;
          const cell = row * columns + column;
          if (tiltedZ <= depth[cell]) continue;
          depth[cell] = tiltedZ;
          const letter = name[(column + row * 3) % name.length];
          letters[cell] = tiltedZ > .25 ? letter.toUpperCase() : letter;
        }
      }
      element.textContent = Array.from({ length: rows }, (_, row) =>
        letters.slice(row * columns, (row + 1) * columns).join('')
      ).join('\n');
    };

    const tick = (now: number): void => {
      if (visible && !document.hidden && now - lastPaint >= 40) {
        draw(now / 1000);
        lastPaint = now;
      }
      frame = window.requestAnimationFrame(tick);
    };
    const updateMotion = (): void => {
      window.cancelAnimationFrame(frame);
      draw(0);
      if (!motion.matches) frame = window.requestAnimationFrame(tick);
    };
    motion.addEventListener('change', updateMotion);
    updateMotion();
    this.destroyRef.onDestroy(() => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', updateMotion);
    });
  }
}
