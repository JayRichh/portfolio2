import type { VercelResponse } from '@vercel/node';
import { GitHubError } from './_core.js';

export function setCacheHeaders(res: VercelResponse, sMaxAge = 3600, swr = 86400): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);
  res.setHeader('CDN-Cache-Control', `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);
  res.setHeader('Vercel-CDN-Cache-Control', `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`);
}

export function respondWithError(res: VercelResponse, error: unknown): void {
  if (error instanceof GitHubError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error('Unexpected error:', error);
  res.status(500).json({ error: 'Unexpected server error' });
}
