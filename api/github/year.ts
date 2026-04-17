import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getYearContributions, parseYearParam } from './_core.js';
import { setCacheHeaders, respondWithError } from './_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCacheHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const year = parseYearParam(req.query['year']);
    const data = await getYearContributions(year);
    return res.json(data);
  } catch (error) {
    return respondWithError(res, error);
  }
}
