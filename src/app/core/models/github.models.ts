export interface ContributionDay {
  readonly day: string;
  readonly value: number;
}

export interface YearContributions {
  readonly year: number;
  readonly contributions: ReadonlyArray<ContributionDay>;
  readonly totalContributions: number;
}

export interface Language {
  readonly name: string;
  readonly percentage: number;
  readonly color: string;
  readonly size: number;
  readonly lineCount: number;
  readonly fileCount: number;
}

export interface LanguageStats {
  readonly languages: ReadonlyArray<Language>;
  readonly totalSize: number;
  readonly totalFiles: number;
  readonly totalLines: number;
}

export interface CachedGitHubData {
  readonly version: number;
  readonly yearData: ReadonlyArray<YearContributions>;
  readonly languageData: LanguageStats | null;
  readonly timestamp: number;
  readonly expiresAt: number;
}

export interface Repository {
  readonly name: string;
  readonly isPrivate: boolean;
  readonly isFork: boolean;
  readonly owner: {
    readonly login: string;
  };
  readonly languages?: {
    readonly edges?: ReadonlyArray<{
      readonly size: number;
      readonly node: {
        readonly name: string;
        readonly color: string;
      };
    }>;
    readonly totalSize?: number;
  };
}

export interface ContributionWeek {
  readonly contributionDays: ReadonlyArray<{
    readonly contributionCount: number;
    readonly date: string;
  }>;
}
