import axios from 'axios';

export const GITHUB_USERNAME = 'JayRichh';
export const EXCLUDED_LANGUAGES = new Set(['Roff']);

export class GitHubError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'GitHubError';
  }
}

export interface ContributionDay {
  day: string;
  value: number;
}

export interface YearContributions {
  year: number;
  contributions: ContributionDay[];
  totalContributions: number;
}

export interface Language {
  name: string;
  percentage: number;
  color: string;
  size: number;
  lineCount: number;
  fileCount: number;
}

export interface LanguageStats {
  languages: Language[];
  totalSize: number;
  totalFiles: number;
  totalLines: number;
}

interface Repository {
  name: string;
  isFork: boolean;
  languages?: {
    edges?: Array<{
      size: number;
      node: { name: string; color: string | null };
    }>;
  };
}

interface YearGraphResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{ contributionCount: number; date: string }>;
        }>;
      };
    };
  };
}

interface RepoGraphResponse {
  user: {
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: Repository[];
    };
  };
}

const YEAR_QUERY = `
  query ContributionsQuery($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { contributionCount date }
          }
        }
      }
    }
  }
`;

const REPOS_QUERY = `
  query RepositoriesQuery($username: String!, $cursor: String) {
    user(login: $username) {
      repositories(
        first: 100,
        after: $cursor,
        ownerAffiliations: [OWNER, COLLABORATOR],
        orderBy: {field: PUSHED_AT, direction: DESC}
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          name
          isFork
          languages(first: 20, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

const BYTES_PER_LINE: Record<string, number> = {
  HTML: 40, CSS: 30, SCSS: 30, JavaScript: 35, TypeScript: 35,
  Python: 25, Go: 20, Rust: 25, C: 20, 'C++': 25,
};

const BYTES_PER_FILE: Record<string, number> = {
  HTML: 8000, CSS: 5000, SCSS: 5000, JavaScript: 10000, TypeScript: 12000,
  Python: 8000, Go: 15000, Rust: 12000, C: 10000, 'C++': 12000,
};

async function fetchGitHub<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env['GITHUB_TOKEN'];
  if (!token) throw new GitHubError(500, 'GitHub API is not configured');

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query, variables },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-App',
        },
        timeout: 28000,
      }
    );

    if (response.data.errors?.length > 0) {
      throw new GitHubError(400, response.data.errors[0].message);
    }

    return response.data.data as T;
  } catch (error: any) {
    if (error instanceof GitHubError) throw error;
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      if (status === 403 && String(message).toLowerCase().includes('rate limit')) {
        throw new GitHubError(429, 'GitHub API rate limit exceeded. Please try again later.');
      }
      if (status === 401) throw new GitHubError(401, 'GitHub authentication failed.');
      throw new GitHubError(status, message);
    }
    if (error.code === 'ECONNABORTED') {
      throw new GitHubError(504, 'Request timeout. GitHub API took too long to respond.');
    }
    throw new GitHubError(500, 'Internal server error while fetching GitHub data');
  }
}

function generateYearDays(year: number): ContributionDay[] {
  const days: ContributionDay[] = [];
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ day: d.toISOString().split('T')[0], value: 0 });
  }
  return days;
}

function scaleContributions(contributions: ContributionDay[]): ContributionDay[] {
  const nonZero = contributions.map(c => c.value).filter(v => v > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) return contributions;

  const quartile = (q: number) => {
    const pos = (nonZero.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    return nonZero[base + 1] !== undefined
      ? nonZero[base] + rest * (nonZero[base + 1] - nonZero[base])
      : nonZero[base];
  };

  const q1 = quartile(0.25);
  const q2 = quartile(0.5);
  const q3 = quartile(0.75);

  return contributions.map(c => ({
    day: c.day,
    value:
      c.value === 0 ? 0 :
      c.value <= q1 ? 1 :
      c.value <= q2 ? 2 :
      c.value <= q3 ? 3 : 4,
  }));
}

export async function getYearContributions(year: number): Promise<YearContributions> {
  const data = await fetchGitHub<YearGraphResponse>(YEAR_QUERY, {
    username: GITHUB_USERNAME,
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  });

  const calendar = data.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new GitHubError(404, `No contribution data for ${year}`);

  const allDays = generateYearDays(year);
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      const existing = allDays.find(d => d.day === day.date);
      if (existing) existing.value = day.contributionCount;
    }
  }

  return {
    year,
    contributions: scaleContributions(allDays),
    totalContributions: calendar.totalContributions,
  };
}

export async function getLanguageStats(): Promise<LanguageStats> {
  const repos: Repository[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const data: RepoGraphResponse = await fetchGitHub<RepoGraphResponse>(REPOS_QUERY, {
      username: GITHUB_USERNAME,
      cursor,
    });

    const reposData = data.user?.repositories;
    if (!reposData) break;

    repos.push(...reposData.nodes.filter((r: Repository) => !r.isFork));
    hasMore = reposData.pageInfo.hasNextPage;
    cursor = reposData.pageInfo.endCursor;
  }

  const map = new Map<string, { size: number; color: string; lineCount: number; fileCount: number }>();
  let totalSize = 0;
  let totalFiles = 0;
  let totalLines = 0;

  for (const repo of repos) {
    if (!repo.languages?.edges) continue;
    for (const edge of repo.languages.edges) {
      const { name, color } = edge.node;
      if (EXCLUDED_LANGUAGES.has(name)) continue;

      const size = edge.size;
      const lineCount = Math.round(size / (BYTES_PER_LINE[name] ?? 30));
      const fileCount = Math.max(1, Math.round(size / (BYTES_PER_FILE[name] ?? 10000)));

      const current = map.get(name) ?? { size: 0, color: color ?? '#666', lineCount: 0, fileCount: 0 };
      map.set(name, {
        size: current.size + size,
        color: current.color,
        lineCount: current.lineCount + lineCount,
        fileCount: current.fileCount + fileCount,
      });

      totalSize += size;
      totalFiles += fileCount;
      totalLines += lineCount;
    }
  }

  const languages: Language[] = Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      size: v.size,
      color: v.color,
      percentage: totalSize > 0 ? Math.round((v.size / totalSize) * 1000) / 10 : 0,
      lineCount: v.lineCount,
      fileCount: v.fileCount,
    }))
    .sort((a, b) => b.size - a.size);

  return { languages, totalSize, totalFiles, totalLines };
}

export function parseYearParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const year = value ? parseInt(value, 10) : new Date().getFullYear();
  if (!Number.isInteger(year) || year < 2008 || year > new Date().getFullYear()) {
    throw new GitHubError(400, 'Invalid year parameter');
  }
  return year;
}
