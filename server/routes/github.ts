import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getYearContributions,
  getLanguageStats,
  parseYearParam,
  GitHubError,
} from '../../api/github/_core';

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

function handleError(res: Response, error: unknown): void {
  if (error instanceof GitHubError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error('Unexpected GitHub error:', error);
  res.status(500).json({ error: 'Unexpected server error' });
}

router.get('/year', limiter, async (req: Request, res: Response) => {
  try {
    const year = parseYearParam(req.query['year'] as string | string[] | undefined);
    const data = await getYearContributions(year);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/languages', limiter, async (_req: Request, res: Response) => {
  try {
    const data = await getLanguageStats();
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
