import { Component, signal, inject, OnInit, computed } from '@angular/core';
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

  readonly loadingLabel = computed(() => {
    const prog = this.progress();
    if (prog < 55) return 'Fetching contribution data...';
    if (prog < 85) return 'Loading language statistics...';
    return 'Preparing charts...';
  });

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
