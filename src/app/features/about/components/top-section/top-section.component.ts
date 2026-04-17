import { ChangeDetectionStrategy, Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { take } from 'rxjs/operators';
import { GitHubService } from '../../../../core/services/github.service';
import { ContributionCalendarComponent } from './charts/contribution-calendar.component';
import { LanguageDonutComponent } from './charts/language-donut.component';
import { LanguageDonutSkeletonComponent } from './charts/skeletons/language-donut-skeleton.component';
import { ContributionCalendarSkeletonComponent } from './charts/skeletons/contribution-calendar-skeleton.component';
import { LoadingProgressComponent } from './loading-progress/loading-progress.component';

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [
    CommonModule,
    ContributionCalendarComponent,
    LanguageDonutComponent,
    LanguageDonutSkeletonComponent,
    ContributionCalendarSkeletonComponent,
    LoadingProgressComponent
  ],
  templateUrl: './top-section.component.html',
  styleUrl: './top-section.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopSectionComponent implements OnInit {
  private readonly githubService = inject(GitHubService);

  readonly selectedYearIndex = signal<number>(0);

  readonly yearData = this.githubService.yearData;
  readonly languageData = this.githubService.languageData;
  readonly isLoadingYear = this.githubService.isLoadingYear;
  readonly isLoadingLanguages = this.githubService.isLoadingLanguages;
  readonly yearError = this.githubService.yearError;
  readonly languageError = this.githubService.languageError;
  readonly anyLoading = this.githubService.isLoading;

  private readonly MIN_YEAR = 2008;
  private readonly CURRENT_YEAR = new Date().getFullYear();

  readonly canGoPrevious = computed(() => {
    const years = this.yearData();
    if (!years.length) return false;
    const idx = this.selectedYearIndex();
    const viewing = years[idx]?.year;
    return viewing !== undefined && viewing > this.MIN_YEAR;
  });

  readonly canGoNext = computed(() => {
    const idx = this.selectedYearIndex();
    const years = this.yearData();
    if (idx > 0) return true;
    const viewing = years[idx]?.year;
    return viewing !== undefined && viewing < this.CURRENT_YEAR;
  });

  readonly loadingLabel = computed(() => {
    const loadingYear = this.isLoadingYear();
    const loadingLangs = this.isLoadingLanguages();
    if (loadingYear && loadingLangs) return 'Loading GitHub data...';
    if (loadingYear) return 'Loading contribution calendar...';
    if (loadingLangs) return 'Aggregating language stats...';
    return '';
  });

  ngOnInit(): void {
    this.githubService.fetchInitial();
  }

  retry(): void {
    this.githubService.retry();
  }

  onPreviousYear(): void {
    const years = this.yearData();
    const currentIndex = this.selectedYearIndex();

    if (currentIndex < years.length - 1) {
      this.selectedYearIndex.set(currentIndex + 1);
      return;
    }

    const viewingYear = years[currentIndex]?.year;
    if (!viewingYear || viewingYear <= this.MIN_YEAR) return;

    const targetYear = viewingYear - 1;
    this.githubService.fetchPreviousYear(targetYear)
      .pipe(take(1))
      .subscribe(() => {
        const idx = this.yearData().findIndex(y => y.year === targetYear);
        if (idx >= 0) this.selectedYearIndex.set(idx);
      });
  }

  onNextYear(): void {
    const years = this.yearData();
    const currentIndex = this.selectedYearIndex();

    if (currentIndex > 0) {
      this.selectedYearIndex.set(currentIndex - 1);
      return;
    }

    const viewingYear = years[currentIndex]?.year;
    if (!viewingYear || viewingYear >= this.CURRENT_YEAR) return;

    const targetYear = viewingYear + 1;
    this.githubService.fetchPreviousYear(targetYear)
      .pipe(take(1))
      .subscribe(() => {
        const idx = this.yearData().findIndex(y => y.year === targetYear);
        if (idx >= 0) this.selectedYearIndex.set(idx);
      });
  }
}
