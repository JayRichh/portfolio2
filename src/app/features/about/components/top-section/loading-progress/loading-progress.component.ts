import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-progress">
      <div class="progress-content">
        <div class="spinner"></div>
        <div class="progress-text">
          <span class="progress-label">{{ label }}</span>
          <span class="progress-percent">{{ progress }}%</span>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" [style.width.%]="progress"></div>
      </div>
    </div>
  `,
  styles: [`
    .loading-progress {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem 0;
      animation: fadeIn 0.3s ease-out;
    }

    .progress-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid hsl(var(--primary) / 0.3);
      border-top-color: hsl(var(--primary));
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .progress-text {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .progress-label {
      font-size: 0.95rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    .progress-percent {
      font-size: 0.875rem;
      color: hsl(var(--primary));
      font-weight: 600;
      min-width: 45px;
      text-align: right;
    }

    .progress-bar-container {
      width: 100%;
      height: 4px;
      background: hsl(var(--muted) / 0.3);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(
        90deg,
        hsl(var(--primary)) 0%,
        hsl(var(--primary) / 0.8) 100%
      );
      transition: width 0.3s ease-out;
      border-radius: 2px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .progress-text {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .progress-percent {
        min-width: auto;
      }
    }
  `]
})
export class LoadingProgressComponent {
  @Input() progress: number = 0;
  @Input() label: string = 'Loading...';
}
