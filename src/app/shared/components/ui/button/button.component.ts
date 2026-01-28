import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s;
      cursor: pointer;
      border: 1px solid transparent;

      &:disabled {
        pointer-events: none;
        opacity: 0.5;
      }

      &.default {
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

        &:hover {
          background: hsl(var(--primary) / 0.9);
        }
      }

      &.destructive {
        background: hsl(var(--destructive));
        color: hsl(var(--destructive-foreground));

        &:hover {
          background: hsl(var(--destructive) / 0.9);
        }
      }

      &.outline {
        border-color: hsl(var(--border));
        background: hsl(var(--background));

        &:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      }

      &.secondary {
        background: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));

        &:hover {
          background: hsl(var(--secondary) / 0.8);
        }
      }

      &.ghost {
        &:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      }

      &.link {
        color: hsl(var(--primary));
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }

      &.size-default {
        height: 2.5rem;
        padding: 0.5rem 1rem;
      }

      &.size-sm {
        height: 2.25rem;
        padding: 0.5rem 0.75rem;
      }

      &.size-lg {
        height: 2.75rem;
        padding: 0.5rem 2rem;
      }

      &.size-icon {
        height: 2.5rem;
        width: 2.5rem;
        padding: 0;
      }
    }
  `],
  host: {
    '[class]': 'classes'
  }
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';

  get classes(): string {
    return `${this.variant} size-${this.size}`;
  }
}
