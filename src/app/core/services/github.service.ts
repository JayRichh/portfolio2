import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, tap, retry, finalize } from 'rxjs/operators';
import {
  YearContributions,
  LanguageStats,
  CachedGitHubData,
} from '../models/github.models';

const YEAR_API = '/api/github/year';
const LANGUAGES_API = '/api/github/languages';
const SNAPSHOT_URL = '/assets/github-snapshot.json';
const CACHE_KEY = 'github-data';
const CACHE_VERSION = 2;
const CACHE_TTL = 60 * 60 * 1000;
const STALE_THRESHOLD = 10 * 60 * 1000;
const SNAPSHOT_REFRESH_THRESHOLD = 24 * 60 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface GitHubSnapshot {
  version: number;
  generatedAt: string | null;
  yearData: YearContributions[];
  languageData: LanguageStats | null;
}

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly http = inject(HttpClient);

  readonly yearData = signal<YearContributions[]>([]);
  readonly languageData = signal<LanguageStats | null>(null);

  readonly isLoadingYear = signal(false);
  readonly isLoadingLanguages = signal(false);
  readonly yearError = signal<string | null>(null);
  readonly languageError = signal<string | null>(null);
  readonly earliestAvailableYear = signal<number | null>(null);

  readonly isLoading = computed(() =>
    (this.isLoadingYear() && this.yearData().length === 0) ||
    (this.isLoadingLanguages() && this.languageData() === null)
  );
  readonly error = computed(() => this.yearError() ?? this.languageError());

  fetchInitial(): void {
    const cached = this.readCache();
    const now = Date.now();

    if (cached) {
      this.yearData.set([...cached.yearData]);
      this.languageData.set(cached.languageData);

      if (now >= cached.expiresAt || now - cached.timestamp > STALE_THRESHOLD) {
        this.refreshInBackground();
      }
      return;
    }

    this.loadSnapshot();
  }

  private loadSnapshot(): void {
    this.isLoadingYear.set(true);
    this.isLoadingLanguages.set(true);

    this.http.get<GitHubSnapshot>(SNAPSHOT_URL).subscribe({
      next: snapshot => {
        const hasData = snapshot.yearData.length > 0 || snapshot.languageData !== null;

        if (hasData) {
          this.yearData.set([...snapshot.yearData].sort((a, b) => b.year - a.year));
          this.languageData.set(snapshot.languageData);
          this.writeCache();
          this.isLoadingYear.set(false);
          this.isLoadingLanguages.set(false);

          const generatedAt = snapshot.generatedAt ? Date.parse(snapshot.generatedAt) : 0;
          if (!generatedAt || Date.now() - generatedAt > SNAPSHOT_REFRESH_THRESHOLD) {
            this.refreshInBackground();
          }
          return;
        }

        this.refreshInBackground();
      },
      error: () => {
        this.refreshInBackground();
      },
    });
  }

  retry(): void {
    this.yearError.set(null);
    this.languageError.set(null);
    this.earliestAvailableYear.set(null);
    this.refreshInBackground();
  }

  fetchPreviousYear(year: number): Observable<YearContributions | null> {
    if (this.yearData().some(y => y.year === year)) {
      return of(this.yearData().find(y => y.year === year) ?? null);
    }
    const earliest = this.earliestAvailableYear();
    if (earliest !== null && year < earliest) {
      return of(null);
    }

    this.isLoadingYear.set(true);
    return this.http.get<YearContributions>(`${YEAR_API}?year=${year}`).pipe(
      tap(yearContrib => {
        const updated = [...this.yearData(), yearContrib].sort((a, b) => b.year - a.year);
        this.yearData.set(updated);
        this.writeCache();
      }),
      catchError(err => {
        this.earliestAvailableYear.set(year + 1);
        this.yearError.set(this.messageFromError(err));
        return of(null);
      }),
      finalize(() => this.isLoadingYear.set(false)),
    );
  }

  private refreshInBackground(): void {
    const currentYear = new Date().getFullYear();
    const hasYearData = this.yearData().length > 0;
    const hasLangData = this.languageData() !== null;

    if (!hasYearData) this.isLoadingYear.set(true);
    this.http.get<YearContributions>(`${YEAR_API}?year=${currentYear}`).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (_, retryCount) => timer(RETRY_DELAY * retryCount),
      }),
      finalize(() => { if (!hasYearData) this.isLoadingYear.set(false); }),
    ).subscribe({
      next: year => {
        const existing = this.yearData().filter(y => y.year !== year.year);
        this.yearData.set([year, ...existing].sort((a, b) => b.year - a.year));
        this.yearError.set(null);
        this.writeCache();
      },
      error: err => {
        if (!hasYearData) this.yearError.set(this.messageFromError(err));
      },
    });

    if (!hasLangData) this.isLoadingLanguages.set(true);
    this.http.get<LanguageStats>(LANGUAGES_API).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (_, retryCount) => timer(RETRY_DELAY * retryCount),
      }),
      finalize(() => { if (!hasLangData) this.isLoadingLanguages.set(false); }),
    ).subscribe({
      next: langs => {
        this.languageData.set(langs);
        this.languageError.set(null);
        this.writeCache();
      },
      error: err => {
        if (!hasLangData) this.languageError.set(this.messageFromError(err));
      },
    });
  }

  private readCache(): CachedGitHubData | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data: CachedGitHubData = JSON.parse(raw);
      if (data.version !== CACHE_VERSION) return null;
      return data;
    } catch {
      return null;
    }
  }

  private writeCache(): void {
    try {
      const data: CachedGitHubData = {
        version: CACHE_VERSION,
        yearData: this.yearData(),
        languageData: this.languageData(),
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to cache GitHub data:', err);
    }
  }

  private messageFromError(error: any): string {
    if (error?.status === 429) return 'GitHub API rate limit exceeded. Please try again later.';
    if (error?.status === 401) return 'GitHub authentication failed.';
    const nested = error?.error?.error;
    if (typeof nested === 'string' && nested.length > 0) return nested;
    const message = error?.message;
    if (typeof message === 'string' && message.length > 0) return message;
    return 'Error fetching GitHub data';
  }
}
