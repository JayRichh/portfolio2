import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError, timer, EMPTY } from 'rxjs';
import { map, catchError, tap, switchMap, retry, delay } from 'rxjs/operators';
import {
  YearContributions,
  LanguageStats,
  CachedGitHubData,
  Repository,
  Language,
  ContributionDay,
  ContributionWeek
} from '../models/github.models';

const GITHUB_API = '/api/github/contributions';
const CACHE_KEY = 'github-data';
const CACHE_VERSION = 1;
const CACHE_TIME = 300_000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MIN_CALL_INTERVAL = 0;
const EXCLUDED_LANGUAGES = new Set(['Roff']);

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly http = inject(HttpClient);
  private lastCallTime = 0;
  private readonly isFetching = signal(false);

  readonly progress = signal(0);
  readonly error = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly yearData = signal<YearContributions[]>([]);
  readonly languageData = signal<LanguageStats | null>(null);

  readonly hasValidCache = computed(() => {
    const cached = this.getCachedData();
    return cached !== null && Date.now() < cached.expiresAt;
  });

  readonly currentYears = computed(() =>
    this.yearData().sort((a, b) => b.year - a.year)
  );

  fetchContributions(): Observable<void> {
    if (this.hasValidCache()) {
      const cached = this.getCachedData();
      if (cached) {
        this.yearData.set([...cached.yearData]);
        this.languageData.set(cached.languageData);
        this.progress.set(100);
        return of(void 0).pipe(delay(100));
      }
    }

    if (this.isFetching()) {
      return EMPTY;
    }

    this.isFetching.set(true);
    this.isLoading.set(true);
    this.error.set(null);
    this.progress.set(5);

    const currentYear = new Date().getFullYear();
    const yearsToFetch = [
      currentYear,
      currentYear - 1,
      currentYear - 2,
      currentYear - 3,
      currentYear - 4
    ];

    return this.fetchAllYearsContributions(yearsToFetch).pipe(
      tap(years => {
        this.yearData.set(years);
        this.progress.set(55);
      }),
      switchMap(() => this.fetchLanguageStats()),
      tap(langStats => {
        this.languageData.set(langStats);
        this.progress.set(85);
      }),
      switchMap(() => this.smoothProgressTo100()),
      tap(() => {
        this.cacheData();
        this.isLoading.set(false);
        this.isFetching.set(false);
      }),
      map(() => void 0),
      catchError(err => {
        this.handleError(err);
        this.isFetching.set(false);
        return throwError(() => err);
      })
    );
  }

  fetchPreviousYear(year: number): Observable<YearContributions | null> {
    return this.fetchYearContributions(year).pipe(
      tap(yearContrib => {
        if (yearContrib) {
          const updated = [...this.yearData(), yearContrib].sort((a, b) => b.year - a.year);
          this.yearData.set(updated);
          this.cacheData();
        }
      }),
      catchError(err => {
        this.handleError(err);
        return of(null);
      })
    );
  }

  private fetchAllYearsContributions(years: number[]): Observable<YearContributions[]> {
    const query = `
      query AllYearsContributions($username: String!) {
        user(login: $username) {
          ${years.map(year => `
            y${year}: contributionsCollection(
              from: "${year}-01-01T00:00:00Z",
              to: "${year}-12-31T23:59:59Z"
            ) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          `).join('\n')}
        }
      }
    `;

    const variables = { username: 'JayRichh' };

    return this.rateLimitedRequest(() =>
      this.http.post<any>(GITHUB_API, { query, variables }).pipe(
        retry({
          count: MAX_RETRIES,
          delay: (error, retryCount) => {
            if (this.isRateLimitError(error)) {
              return timer(RETRY_DELAY * retryCount);
            }
            return throwError(() => error);
          }
        }),
        map(response => {
          if (response.errors?.length > 0) {
            throw new Error(response.errors[0].message);
          }

          const userData = response.data?.user;
          if (!userData) return [];

          return years.map(year => {
            const calendar = userData[`y${year}`]?.contributionCalendar;
            if (!calendar) return null;

            const allDays = this.generateYearDays(year);
            calendar.weeks.forEach((week: ContributionWeek) => {
              week.contributionDays.forEach((day: { contributionCount: number; date: string }) => {
                const existing = allDays.find(d => d.day === day.date);
                if (existing) {
                  (existing as any).value = day.contributionCount;
                }
              });
            });

            return {
              year,
              contributions: this.scaleContributions(allDays),
              totalContributions: calendar.totalContributions,
            } as YearContributions;
          }).filter((y): y is YearContributions => y !== null);
        }),
        catchError(err => {
          console.error('Error fetching batched contributions:', err);
          return of([]);
        })
      )
    );
  }

  private fetchYearContributions(year: number): Observable<YearContributions | null> {
    const query = `
      query ContributionsQuery($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: 'JayRichh',
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`,
    };

    return this.rateLimitedRequest(() =>
      this.http.post<any>(GITHUB_API, { query, variables }).pipe(
        retry({
          count: MAX_RETRIES,
          delay: (error, retryCount) => {
            if (this.isRateLimitError(error)) {
              return timer(RETRY_DELAY * retryCount);
            }
            return throwError(() => error);
          }
        }),
        map(response => {
          if (response.errors?.length > 0) {
            throw new Error(response.errors[0].message);
          }

          const calendar = response.data?.user?.contributionsCollection?.contributionCalendar;
          if (!calendar) return null;

          const weeks: ContributionWeek[] = calendar.weeks;
          const allDays = this.generateYearDays(year);

          weeks.forEach(week => {
            week.contributionDays.forEach(day => {
              const existing = allDays.find(d => d.day === day.date);
              if (existing) {
                (existing as any).value = day.contributionCount;
              }
            });
          });

          const scaledContributions = this.scaleContributions(allDays);

          return {
            year,
            contributions: scaledContributions,
            totalContributions: calendar.totalContributions,
          };
        }),
        catchError(err => {
          console.error(`Error fetching year ${year}:`, err);
          return of(null);
        })
      )
    );
  }

  private fetchLanguageStats(): Observable<LanguageStats> {
    return this.fetchAllRepositories().pipe(
      map(repos => this.aggregateLanguageStats(repos))
    );
  }

  private fetchAllRepositories(): Observable<Repository[]> {
    const query = `
      query RepositoriesQuery($username: String!, $cursor: String) {
        user(login: $username) {
          repositories(
            first: 100,
            after: $cursor,
            ownerAffiliations: [OWNER],
            orderBy: {field: PUSHED_AT, direction: DESC}
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              isPrivate
              isFork
              owner {
                login
              }
              languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
                totalSize
              }
            }
          }
        }
      }
    `;

    return this.fetchRepositoriesRecursive(query, null, [], 0);
  }

  private fetchRepositoriesRecursive(
    query: string,
    cursor: string | null,
    accumulated: Repository[],
    pageCount: number
  ): Observable<Repository[]> {
    const variables = { username: 'JayRichh', cursor };

    return this.rateLimitedRequest(() =>
      this.http.post<any>(GITHUB_API, { query, variables }).pipe(
        retry({
          count: MAX_RETRIES,
          delay: (error, retryCount) => timer(RETRY_DELAY * retryCount)
        }),
        switchMap(response => {
          if (response.errors?.length > 0) {
            throw new Error(response.errors[0].message);
          }

          const reposData = response.data?.user?.repositories;
          if (!reposData) {
            return of(accumulated);
          }

          const newAccumulated = [...accumulated, ...reposData.nodes];
          const newPageCount = pageCount + 1;

          const progressIncrement = Math.min(3.5, 25 / Math.max(newPageCount, 1));
          const newProgress = Math.min(80, 55 + (newPageCount * progressIncrement));
          this.progress.set(Math.round(newProgress));

          if (reposData.pageInfo.hasNextPage) {
            return this.fetchRepositoriesRecursive(query, reposData.pageInfo.endCursor, newAccumulated, newPageCount);
          }

          return of(newAccumulated);
        })
      )
    );
  }

  private aggregateLanguageStats(repos: Repository[]): LanguageStats {
    const languageMap = new Map<string, { size: number; color: string; lineCount: number; fileCount: number }>();
    let totalSize = 0;
    let totalFiles = 0;
    let totalLines = 0;

    repos.forEach(repo => {
      if (!repo.languages?.edges) return;

      repo.languages.edges.forEach(edge => {
        const { name, color } = edge.node;
        if (EXCLUDED_LANGUAGES.has(name)) return;

        const size = edge.size;
        const lineCount = this.estimateLineCount(size, name);
        const fileCount = this.estimateFileCount(size, name);

        const current = languageMap.get(name) || { size: 0, color, lineCount: 0, fileCount: 0 };

        languageMap.set(name, {
          size: current.size + size,
          color,
          lineCount: current.lineCount + lineCount,
          fileCount: current.fileCount + fileCount,
        });

        totalSize += size;
        totalFiles += fileCount;
        totalLines += lineCount;
      });
    });

    const languages: Language[] = Array.from(languageMap.entries())
      .map(([name, { size, color, lineCount, fileCount }]) => ({
        name,
        size,
        color: color || '#666',
        percentage: Math.round((size / totalSize) * 100 * 10) / 10,
        lineCount,
        fileCount,
      }))
      .sort((a, b) => b.size - a.size);

    return { languages, totalSize, totalFiles, totalLines };
  }

  private generateYearDays(year: number): ContributionDay[] {
    const days: ContributionDay[] = [];
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
      days.push({
        day: d.toISOString().split('T')[0],
        value: 0,
      });
    }

    return days;
  }

  private scaleContributions(contributions: ContributionDay[]): ContributionDay[] {
    const nonZeroValues = contributions.map(c => c.value).filter(v => v > 0);
    if (nonZeroValues.length === 0) return contributions;

    nonZeroValues.sort((a, b) => a - b);

    const getQuartile = (arr: number[], quartile: number) => {
      const pos = (arr.length - 1) * quartile;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (arr[base + 1] !== undefined) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      }
      return arr[base];
    };

    const q1 = getQuartile(nonZeroValues, 0.25);
    const q2 = getQuartile(nonZeroValues, 0.5);
    const q3 = getQuartile(nonZeroValues, 0.75);

    return contributions.map(contribution => ({
      day: contribution.day,
      value:
        contribution.value === 0
          ? 0
          : contribution.value <= q1
          ? 1
          : contribution.value <= q2
          ? 2
          : contribution.value <= q3
          ? 3
          : 4,
    }));
  }

  private estimateLineCount(size: number, language: string): number {
    const bytesPerLine: Record<string, number> = {
      HTML: 40,
      CSS: 30,
      SCSS: 30,
      JavaScript: 35,
      TypeScript: 35,
      Python: 25,
      Go: 20,
      Rust: 25,
      C: 20,
      'C++': 25,
    };

    const bpl = bytesPerLine[language] || 30;
    return Math.round(size / bpl);
  }

  private estimateFileCount(size: number, language: string): number {
    const bytesPerFile: Record<string, number> = {
      HTML: 8000,
      CSS: 5000,
      SCSS: 5000,
      JavaScript: 10000,
      TypeScript: 12000,
      Python: 8000,
      Go: 15000,
      Rust: 12000,
      C: 10000,
      'C++': 12000,
    };

    const bpf = bytesPerFile[language] || 10000;
    return Math.max(1, Math.round(size / bpf));
  }

  private rateLimitedRequest<T>(requestFn: () => Observable<T>): Observable<T> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;

    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
      return timer(MIN_CALL_INTERVAL - timeSinceLastCall).pipe(
        switchMap(() => {
          this.lastCallTime = Date.now();
          return requestFn();
        })
      );
    }

    this.lastCallTime = now;
    return requestFn();
  }

  private smoothProgressTo100(): Observable<void> {
    const delays = [80, 90, 100, 120, 140, 160, 180, 200, 220, 240];
    let currentProgress = 90;

    return new Observable(observer => {
      const interval = setInterval(() => {
        if (currentProgress >= 100) {
          clearInterval(interval);
          this.progress.set(100);
          observer.next();
          observer.complete();
          return;
        }

        this.progress.set(currentProgress + 1);
        currentProgress++;
      }, delays[currentProgress - 90] || 240);
    });
  }

  private getCachedData(): CachedGitHubData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: CachedGitHubData = JSON.parse(cached);
      if (data.version !== CACHE_VERSION) return null;

      return data;
    } catch {
      return null;
    }
  }

  private cacheData(): void {
    try {
      const data: CachedGitHubData = {
        version: CACHE_VERSION,
        yearData: this.yearData(),
        languageData: this.languageData(),
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TIME,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to cache data:', err);
    }
  }

  private isRateLimitError(error: any): boolean {
    return (
      error.status === 403 ||
      error.status === 429 ||
      error.message?.toLowerCase().includes('rate limit')
    );
  }

  private handleError(error: any): void {
    let message = 'Error fetching GitHub data';

    if (this.isRateLimitError(error)) {
      message = 'GitHub API rate limit exceeded. Please try again later.';
    } else if (error.status === 401) {
      message = 'GitHub authentication failed. Please check your token.';
    } else if (error.message) {
      message = error.message;
    }

    this.error.set(message);
    this.isLoading.set(false);
    this.progress.set(0);
  }
}
