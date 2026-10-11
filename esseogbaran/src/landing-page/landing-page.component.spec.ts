import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let disconnect: jest.Mock;
  let removeMotionListener: jest.Mock;

  beforeEach(() => {
    disconnect = jest.fn();
    removeMotionListener = jest.fn();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
    (window.matchMedia as jest.Mock).mockReset().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: removeMotionListener,
    });
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: jest.fn(() => ({ observe: jest.fn(), disconnect })),
    });
    jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    fixture.destroy();
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the ring on the first view without navigating', () => {
    const host = fixture.nativeElement.querySelector(
      'app-name-ring'
    ) as HTMLElement;
    const ring = host.querySelector('pre')!;
    // The browser-owned subtree must not be claimed by initial-page hydration.
    expect(host.getAttribute('ngSkipHydration')).toBe('true');
    expect(ring.textContent!.split('\n')).toHaveLength(54);
    expect(ring.textContent!.replace(/\s/g, '').length).toBeGreaterThan(1000);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('shows a static ring on the first view when reduced motion is enabled', () => {
    fixture.destroy();
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: removeMotionListener,
    });
    (window.requestAnimationFrame as jest.Mock).mockClear();
    fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const ring = fixture.nativeElement.querySelector(
      'app-name-ring pre'
    ) as HTMLElement;
    expect(ring.textContent!.replace(/\s/g, '').length).toBeGreaterThan(1000);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('cleans up the animation when leaving the page', () => {
    (window.cancelAnimationFrame as jest.Mock).mockClear();
    fixture.destroy();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalled();
    expect(removeMotionListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
