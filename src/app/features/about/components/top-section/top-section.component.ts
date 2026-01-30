import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { take } from 'rxjs/operators';
import { GitHubService } from '../../../../core/services/github.service';
import { ProgressLoaderComponent } from '../../../../shared/components/ui/progress-loader/progress-loader.component';
import { ContributionCalendarComponent } from './charts/contribution-calendar.component';
import { LanguageDonutComponent } from './charts/language-donut.component';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [
    CommonModule,
    ProgressLoaderComponent,
    ContributionCalendarComponent,
    LanguageDonutComponent
  ],
  template: `
    <section class="top-section">
      <div class="top-container">
        @if (isLoading()) {
          <div class="loading-container" @fadeIn>
            <app-progress-loader [progress]="progress()" />
          </div>
        } @else if (error()) {
          <div class="error-container" @fadeIn>
            <div class="error-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p class="error-message">{{ error() }}</p>
              <button (click)="retry()" class="retry-button">
                Retry
              </button>
            </div>
          </div>
        } @else {
          <div class="content-grid" @fadeIn>
            <div class="header-content">
              <h1 class="main-title">Full Stack Web</h1>
              <p class="subtitle">
                Building modern web experiences with cutting-edge technologies.
                Passionate about clean code, performance optimization, and creating
                intuitive user interfaces.
              </p>
            </div>

            @if (languageData()) {
              <div class="chart-card pie-chart">
                <app-language-donut [data]="languageData()!" />
              </div>
            }

            @if (yearData().length > 0) {
              <div class="chart-card calendar-chart">
                <app-contribution-calendar
                  [data]="yearData()[selectedYearIndex()]"
                  [isLoadingYear]="isLoading()"
                  [currentYearIndex]="selectedYearIndex()"
                  [totalYears]="yearData().length"
                  (previousYear)="onPreviousYear()"
                  (nextYear)="onNextYear()"
                />
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .top-section {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.3) 100%);
    }

    .top-container {
      margin: 0 auto;
      padding: 2rem 0;
      width: 100%;
      max-width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .header-content {
      text-align: left;
      max-width: 700px;
    }

    .main-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.2;
      color: hsl(var(--foreground));
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.125rem;
      line-height: 1.6;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      width: 100%;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
    }

    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 500px;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 3rem 2rem;
      text-align: center;
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border) / 0.5);
      border-radius: var(--radius);
      max-width: 500px;
      width: 100%;

      svg {
        color: hsl(var(--destructive));
      }
    }

    .error-message {
      font-size: 1rem;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }

    .retry-button {
      padding: 0.75rem 1.5rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      border-radius: var(--radius);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .chart-card {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chart-card > * {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 100%;
      height: 100%;
    }

    @media (max-width: 1023px) {
      .top-section {
        padding: 4rem 1rem 2rem;
        min-height: auto;
      }

      .top-container {
        padding: 0;
      }

      .header-content {
        margin-bottom: 2rem;
        max-width: 100%;
      }

      .main-title {
        font-size: clamp(1.75rem, 6vw, 2.5rem);
      }

      .subtitle {
        font-size: 1rem;
      }

      .content-grid {
        gap: 1.5rem;
      }

      .pie-chart {
        min-height: 450px;
      }

      .calendar-chart {
        min-height: 350px;
      }
    }

    @media (min-width: 1024px) {
      .top-section {
        padding: 8rem 1rem 4rem;
        max-height: 100vh;
      }

      .top-container {
        max-height: 100%;
      }

      .content-grid {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 1fr;
        gap: 3rem;
        align-items: start;
        max-height: calc(100vh - 12rem);
        min-height: 0;
      }

      .header-content {
        grid-column: 1;
        grid-row: 1;
      }

      .pie-chart {
        grid-column: 2;
        grid-row: 1 / -1;
        align-self: stretch;
        height: 100%;
        max-height: 100%;
      }

      .calendar-chart {
        grid-column: 1;
        grid-row: 2;
        height: 100%;
        max-height: 100%;
        min-height: 0;
      }

      .chart-card {
        max-height: 100%;
      }

      .chart-card > * {
        max-height: 100%;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TopSectionComponent implements OnInit {
  private readonly githubService = inject(GitHubService);

  readonly selectedYearIndex = signal<number>(0);

  readonly isLoading = this.githubService.isLoading;
  readonly error = this.githubService.error;
  readonly progress = this.githubService.progress;
  readonly yearData = this.githubService.yearData;
  readonly languageData = this.githubService.languageData;

  ngOnInit(): void {
    if (this.yearData().length === 0) {
      this.githubService.fetchContributions()
        .pipe(take(1))
        .subscribe();
    }
  }

  retry(): void {
    this.githubService.fetchContributions()
      .pipe(take(1))
      .subscribe();
  }

  onPreviousYear(): void {
    const years = this.yearData();
    const currentIndex = this.selectedYearIndex();

    if (currentIndex < years.length - 1) {
      this.selectedYearIndex.set(currentIndex + 1);
    } else {
      const oldestYear = years[years.length - 1]?.year;
      if (oldestYear) {
        this.githubService.fetchPreviousYear(oldestYear - 1)
          .pipe(take(1))
          .subscribe(() => {
            this.selectedYearIndex.set(this.yearData().length - 1);
          });
      }
    }
  }

  onNextYear(): void {
    const currentIndex = this.selectedYearIndex();
    if (currentIndex > 0) {
      this.selectedYearIndex.set(currentIndex - 1);
    }
  }
}
