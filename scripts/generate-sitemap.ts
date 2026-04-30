import { SitemapStream, streamToPromise, EnumChangefreq } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { resolve } from 'path';
import { projectData } from '../src/app/data/projectData';

interface RouteEntry {
  url: string;
  changefreq: EnumChangefreq;
  priority: number;
  lastmod?: string;
}

const HOSTNAME = 'https://jayrich.dev';
const SITEMAP_PATH = resolve(__dirname, '../public/sitemap.xml');
const PRERENDER_PATH = resolve(__dirname, '../prerender-routes.txt');

const staticRoutes: RouteEntry[] = [
  { url: '/', changefreq: EnumChangefreq.WEEKLY, priority: 1.0 },
  { url: '/about', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/code', changefreq: EnumChangefreq.WEEKLY, priority: 0.9 },
  { url: '/work', changefreq: EnumChangefreq.MONTHLY, priority: 0.7 }
];

const projectRoutes: RouteEntry[] = projectData.map(p => ({
  url: `/code/${p.slug}`,
  changefreq: EnumChangefreq.MONTHLY,
  priority: 0.8,
  lastmod: p.updatedAt
}));

const allRoutes = [...staticRoutes, ...projectRoutes];

async function writeSitemap(): Promise<void> {
  const stream = new SitemapStream({ hostname: HOSTNAME });
  const writeStream = createWriteStream(SITEMAP_PATH);
  stream.pipe(writeStream);
  allRoutes.forEach(r => stream.write(r));
  stream.end();
  await streamToPromise(stream);
}

function writePrerenderList(): void {
  const lines = allRoutes.map(r => r.url).join('\n');
  writeFileSync(PRERENDER_PATH, `${lines}\n`);
}

async function main(): Promise<void> {
  await writeSitemap();
  writePrerenderList();
  console.log(`Sitemap: ${allRoutes.length} URLs`);
  console.log(`Prerender list: ${allRoutes.length} routes`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
