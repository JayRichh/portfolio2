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
        <app-skeleton-loader width="150px" height="24px" />
      </div>
      <div class="skeleton-body">
        <app-skeleton-loader width="280px" height="280px" [circle]="true" class="skeleton-chart" />
        <div class="skeleton-stats">
          <app-skeleton-loader width="120px" height="16px" />
          <app-skeleton-loader width="120px" height="16px" />
        </div>
      </div>
      <div class="skeleton-legend">
        <app-skeleton-loader width="100%" height="40px" *ngFor="let i of [1,2,3,4,5]" />
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
    }

    .skeleton-header {
      display: flex;
      justify-content: center;
    }

    .skeleton-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .skeleton-chart {
      max-width: 280px;
    }

    .skeleton-stats {
      display: flex;
      gap: 2rem;
    }

    .skeleton-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
    }

    @media (max-width: 768px) {
      .skeleton-chart {
        max-width: 240px;
      }
    }
  `]
})
export class LanguageDonutSkeletonComponent {}
