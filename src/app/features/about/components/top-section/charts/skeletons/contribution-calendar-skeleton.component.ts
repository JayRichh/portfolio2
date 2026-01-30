import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '@shared/components/ui/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-contribution-calendar-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="skeleton-container">
      <div class="skeleton-header">
        <app-skeleton-loader width="200px" height="28px" />
      </div>
      <div class="skeleton-controls">
        <app-skeleton-loader width="120px" height="36px" />
        <app-skeleton-loader width="120px" height="36px" />
      </div>
      <div class="skeleton-legend">
        <app-skeleton-loader width="60px" height="16px" />
        <div class="skeleton-legend-boxes">
          <app-skeleton-loader width="16px" height="16px" *ngFor="let i of [1,2,3,4,5]" />
        </div>
        <app-skeleton-loader width="60px" height="16px" />
      </div>
      <div class="skeleton-calendar">
        <app-skeleton-loader width="100%" height="100%" />
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
      gap: 1rem;
      height: 100%;
      max-height: 100%;
      min-height: 220px;
    }

    .skeleton-header {
      display: flex;
      justify-content: center;
    }

    .skeleton-controls {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .skeleton-legend {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    .skeleton-legend-boxes {
      display: flex;
      gap: 0.25rem;
    }

    .skeleton-calendar {
      width: 100%;
      flex: 1;
      min-height: 140px;
    }

    @media (max-width: 768px) {
      .skeleton-container {
        padding: 1.25rem;
        min-height: 170px;
      }

      .skeleton-calendar {
        min-height: 120px;
      }
    }

    @media (max-width: 480px) {
      .skeleton-container {
        padding: 1rem;
        min-height: 140px;
      }

      .skeleton-calendar {
        min-height: 100px;
      }
    }
  `]
})
export class ContributionCalendarSkeletonComponent {}
