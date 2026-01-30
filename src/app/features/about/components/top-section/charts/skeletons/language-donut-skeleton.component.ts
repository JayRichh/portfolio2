import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '@shared/components/ui/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-language-donut-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="skeleton-container">
      <div class="skeleton-header">
        <app-skeleton-loader width="180px" height="28px" />
      </div>

      <div class="skeleton-layout">
        <div class="skeleton-chart-wrapper">
          <div class="skeleton-chart-content">
            <app-skeleton-loader width="100%" height="100%" [circle]="true" class="skeleton-chart" />
            <div class="skeleton-footer">
              <app-skeleton-loader width="130px" height="18px" />
              <app-skeleton-loader width="130px" height="18px" />
            </div>
          </div>
        </div>

        <div class="skeleton-stats-panel">
          <app-skeleton-loader width="100%" height="48px" *ngFor="let i of [1,2,3,4,5,6,7,8]" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      background: hsl(var(--card));
      border-radius: calc(var(--radius) - 2px);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
      max-height: 100%;
    }

    .skeleton-header {
      display: flex;
      justify-content: flex-start;
    }

    .skeleton-layout {
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      gap: 2rem;
      flex: 1;
      min-height: 0;
    }

    .skeleton-chart-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .skeleton-chart-content {
      width: 100%;
      max-width: 450px;
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .skeleton-chart {
      flex: 1;
      width: 100%;
    }

    .skeleton-footer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .skeleton-stats-panel {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      max-height: 100%;
      padding-right: 0.5rem;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: hsl(var(--muted) / 0.3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: hsl(var(--muted-foreground) / 0.3);
        border-radius: 3px;

        &:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      }
    }

    @media (max-width: 1024px) {
      .skeleton-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .skeleton-chart-content {
        max-width: 280px;
      }

      .skeleton-stats-panel {
        max-height: 300px;
      }
    }

    @media (max-width: 768px) {
      .skeleton-container {
        padding: 1.25rem;
        gap: 1.25rem;
      }

      .skeleton-layout {
        gap: 1.5rem;
      }

      .skeleton-chart-content {
        max-width: 240px;
      }
    }
  `]
})
export class LanguageDonutSkeletonComponent {}
