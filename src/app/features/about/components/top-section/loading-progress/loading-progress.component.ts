import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-progress">
      <div class="progress-content">
        <div class="spinner"></div>
        <span class="progress-label">{{ label }}</span>
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
      to { transform: rotate(360deg); }
    }

    .progress-label {
      font-size: 0.95rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingProgressComponent {
  @Input() label: string = 'Loading...';
}
