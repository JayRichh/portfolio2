import { Component } from '@angular/core';

@Component({
  selector: 'textarea[appTextarea]',
  standalone: true,
  template: '',
  styles: [`
    :host {
      display: flex;
      min-height: 60px;
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      transition: all 0.15s;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: hsl(var(--primary));
        box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      &::placeholder {
        color: hsl(var(--muted-foreground));
      }
    }
  `]
})
export class TextareaComponent {}
