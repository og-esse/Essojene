import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-name-ring',
  standalone: true,
  host: { ngSkipHydration: 'true', 'aria-hidden': 'true' },
  template: '<pre #nameSculpture class="name-sculpture"></pre>',
  styleUrl: './name-ring.component.scss',
})
export class NameRingComponent {
  @ViewChild('nameSculpture') private sculpture!: ElementRef<HTMLPreElement>;
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Only this DOM-driven animation skips hydration; the surrounding page still hydrates.
    // afterNextRender waits for the new view and does not execute during server rendering.
    afterNextRender(() =>
      this.zone.runOutsideAngular(() => this.animateName())
    );
  }

  private animateName(): void {
    const element = this.sculpture.nativeElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const columns = 84;
    const rows = 54;
    const name = 'esséogbaran';
    let frame = 0;
    let lastPaint = -Infinity;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(element);

    const depth = new Float32Array(columns * rows);
    const letters = new Array<string>(columns * rows);
    const tones = new Uint8Array(columns * rows);
    let startedAt: number | undefined;

    const draw = (seconds: number): void => {
      depth.fill(-Infinity);
      letters.fill(' ');
      tones.fill(0);
      // A gentle tilt reveals the inner wall while the ring turns around its vertical axis.
      const tilt = 0.32 + Math.sin(seconds * 0.2) * 0.22;
      const turn = 0.3 + seconds * 0.45;
      const roll = Math.sin(seconds * 0.25) * 0.1;
      const cp = Math.cos(roll),
        sp = Math.sin(roll);
      const ct = Math.cos(tilt),
        st = Math.sin(tilt);
      const cr = Math.cos(turn),
        sr = Math.sin(turn);

      // Project a rotating torus onto a character grid; every visible cell is part of the name.
      for (let around = 0; around < Math.PI * 2; around += 0.035) {
        for (let tube = 0; tube < Math.PI * 2; tube += 0.055) {
          const radius = 1.48 + 0.74 * Math.cos(tube);
          const x = radius * Math.cos(around);
          const y = radius * Math.sin(around);
          const z = 0.74 * Math.sin(tube);
          const tiltedY = y * ct - z * st;
          const tiltedZ = y * st + z * ct;
          const turnedX = x * cr + tiltedZ * sr;
          const rotatedX = turnedX * cp - tiltedY * sp;
          const rotatedY = turnedX * sp + tiltedY * cp;
          const rotatedZ = -x * sr + tiltedZ * cr;
          const perspective = 98 / (6.1 - rotatedZ);
          const column = Math.round(columns / 2 + rotatedX * perspective);
          const row = Math.round(rows / 2 + rotatedY * perspective * 0.6);
          if (column < 0 || column >= columns || row < 0 || row >= rows)
            continue;
          const cell = row * columns + column;
          if (rotatedZ <= depth[cell]) continue;
          depth[cell] = rotatedZ;
          const letter = name[(column + row * 3) % name.length];
          letters[cell] = rotatedZ > 0.25 ? letter.toUpperCase() : letter;
          // Rotate the surface normal with the geometry, then light it from above-left.
          const nx = Math.cos(tube) * Math.cos(around);
          const ny = Math.cos(tube) * Math.sin(around);
          const nz = Math.sin(tube);
          const tiltedNY = ny * ct - nz * st;
          const tiltedNZ = ny * st + nz * ct;
          const turnedNX = nx * cr + tiltedNZ * sr;
          const normalX = turnedNX * cp - tiltedNY * sp;
          const normalY = turnedNX * sp + tiltedNY * cp;
          const normalZ = -nx * sr + tiltedNZ * cr;
          const light = Math.max(
            0,
            -0.4 * normalX - 0.5 * normalY + 0.76 * normalZ
          );
          const proximity = (rotatedZ + 2.22) / 4.44;
          tones[cell] = Math.min(
            4,
            Math.floor((light * 0.65 + proximity * 0.35) * 5)
          );
        }
      }
      const output = document.createDocumentFragment();
      for (let row = 0; row < rows; row++) {
        let column = 0;
        while (column < columns) {
          const start = row * columns + column;
          const tone = tones[start];
          let run = letters[start];
          column++;
          while (column < columns && tones[row * columns + column] === tone) {
            run += letters[row * columns + column++];
          }
          const span = document.createElement('span');
          span.className = [
            'ring-far',
            'ring-soft',
            'ring-mid',
            'ring-front',
            'ring-near',
          ][tone];
          span.textContent = run;
          output.appendChild(span);
        }
        if (row < rows - 1) output.appendChild(document.createTextNode('\n'));
      }
      element.replaceChildren(output);
    };

    const tick = (now: number): void => {
      if (visible && !document.hidden && now - lastPaint >= 50) {
        startedAt ??= now;
        draw((now - startedAt) / 1000);
        lastPaint = now;
      }
      frame = window.requestAnimationFrame(tick);
    };
    const updateMotion = (): void => {
      window.cancelAnimationFrame(frame);
      startedAt = undefined;
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
