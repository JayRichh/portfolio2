import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLanguageStats } from './_core';
import { setCacheHeaders, respondWithError } from './_lib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCacheHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const data = await getLanguageStats();
    return res.json(data);
  } catch (error) {
    return respondWithError(res, error);
  }
}
