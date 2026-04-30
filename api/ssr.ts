import type { VercelRequest, VercelResponse } from '@vercel/node';

const SERVER_BUNDLE_PATH: string = '../dist/portfolio2/server/server.mjs';

let cachedApp: any;

async function getApp() {
  if (!cachedApp) {
    const mod = await import(SERVER_BUNDLE_PATH);
    cachedApp = mod.app();
  }
  return cachedApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
  const server = await getApp();
  return server(req, res);
}
