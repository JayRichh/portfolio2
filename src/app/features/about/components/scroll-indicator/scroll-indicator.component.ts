import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="showIndicator()"
      type="button"
      class="scroll-indicator"
      [class.at-bottom]="isAtBottom()"
      (click)="handleScroll()"
      @fadeInOut
      [attr.aria-label]="isAtBottom() ? 'Scroll to top' : 'Scroll down'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="indicator-icon"
        [style.transform]="'rotate(' + rotation() + 'deg)'"
      >
        <path d="m18 15-6-6-6 6"/>
      </svg>

      <div class="tooltip">
        {{ isAtBottom() ? 'Scroll to top' : 'Scroll down' }}
      </div>
    </button>
  `,
  styles: [`
    .scroll-indicator {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
      z-index: 50;
    }

    .scroll-indicator:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2),
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .scroll-indicator:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }

    .scroll-indicator:active {
      transform: scale(0.95);
    }

    .indicator-icon {
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .at-bottom .indicator-icon {
      animation: bounce-up 2s infinite;
    }

    .scroll-indicator:not(.at-bottom) .indicator-icon {
      animation: bounce-down 2s infinite;
    }

    @keyframes bounce-down {
      0%, 100% {
        transform: translateY(0) rotate(180deg);
      }
      50% {
        transform: translateY(4px) rotate(180deg);
      }
    }

    @keyframes bounce-up {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-4px) rotate(0deg);
      }
    }

    .tooltip {
      position: absolute;
      bottom: 100%;
      right: 0;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: hsl(var(--popover));
      color: hsl(var(--popover-foreground));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      pointer-events: none;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    @media (max-width: 640px) {
      .scroll-indicator {
        bottom: 5rem;
        right: 1rem;
        width: 3rem;
        height: 3rem;
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class ScrollIndicatorComponent implements OnInit, OnDestroy {
  readonly showIndicator = signal(false);
  readonly isAtBottom = signal(false);
  readonly rotation = signal(180);

  private scrollListener?: () => void;
  private resizeListener?: () => void;
  private debounceTimeout?: number;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.scrollListener = this.handleScrollEvent.bind(this);
      this.resizeListener = this.checkScrollable.bind(this);

      window.addEventListener('scroll', this.scrollListener, { passive: true });
      window.addEventListener('resize', this.resizeListener, { passive: true });

      this.checkScrollable();
      this.handleScrollEvent();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
      }
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
    }
  }

  private handleScrollEvent(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = window.setTimeout(() => {
      this.updateScrollState();
    }, 100);
  }

  private updateScrollState(): void {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollPercent = scrollTop / (docHeight - windowHeight);

    this.rotation.set(scrollPercent * 180);

    const nearBottom = scrollTop + windowHeight >= docHeight - 50;
    this.isAtBottom.set(nearBottom);

    const scrolledPast100vh = scrollTop > windowHeight;
    const isScrollable = docHeight > windowHeight;
    this.showIndicator.set(isScrollable && scrolledPast100vh);
  }

  private checkScrollable(): void {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrolledPast100vh = scrollTop > windowHeight;
    const isScrollable = docHeight > windowHeight;
    this.showIndicator.set(isScrollable && scrolledPast100vh);
  }

  handleScroll(): void {
    if (this.isAtBottom()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const scrollAmount = window.innerHeight * 0.85;
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  }
}
