import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '@shared/components/ui/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-language-donut-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="donut-chart-container">
      <div class="chart-header">
        <app-skeleton-loader width="180px" height="28px" />
      </div>

      <div class="chart-layout">
        <div class="chart-section">
          <div class="chart-wrapper">
            <div class="donut-placeholder">
              <app-skeleton-loader width="100%" height="100%" [circle]="true" />
            </div>
            <div class="chart-footer">
              <app-skeleton-loader width="130px" height="18px" />
              <app-skeleton-loader width="130px" height="18px" />
            </div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stats-scroll-container">
            <div class="stats-grid">
              <app-skeleton-loader width="100%" height="92px" *ngFor="let i of rows" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .donut-chart-container {
      background: hsl(var(--card));
      border-radius: var(--radius);
      padding: 1.5rem;
      border: 1px solid hsl(var(--border) / 0.5);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chart-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      min-height: 28px;
    }

    .chart-layout {
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      gap: 2rem;
      flex: 1;
      min-height: 0;
      align-items: stretch;
    }

    .chart-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 100%;
    }

    .chart-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      width: 100%;
    }

    .donut-placeholder {
      width: 100%;
      max-width: 450px;
      aspect-ratio: 1;
    }

    .chart-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .stats-section {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .stats-scroll-container {
      flex: 1;
      min-height: 0;
      overflow-y: hidden;
      padding-right: 0.5rem;
    }

    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    @media (max-width: 1024px) {
      .chart-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .chart-section { order: 1; }
      .stats-section { order: 2; }
      .donut-placeholder { max-width: 280px; }
    }

    @media (max-width: 768px) {
      .donut-chart-container {
        padding: 1.25rem;
        height: auto;
        min-height: 450px;
      }
      .chart-header { margin-bottom: 1rem; }
      .chart-layout { gap: 1.5rem; height: auto; }
      .donut-placeholder { max-width: 280px; }
      .stats-scroll-container { max-height: 300px; }
    }

    @media (max-width: 480px) {
      .donut-chart-container { padding: 1rem; min-height: 400px; }
      .chart-header { margin-bottom: 0.75rem; }
      .chart-layout { gap: 1.5rem; }
      .donut-placeholder { max-width: 240px; }
      .stats-scroll-container { max-height: 250px; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDonutSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5, 6, 7, 8];
}
