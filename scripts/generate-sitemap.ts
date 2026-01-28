import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

const links = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/code', changefreq: 'weekly', priority: 0.9 },
  { url: '/work', changefreq: 'monthly', priority: 0.7 },
];

const stream = new SitemapStream({ hostname: 'https://jayrich.dev' });
const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap.xml'));

stream.pipe(writeStream);
links.forEach(link => stream.write(link));
stream.end();

streamToPromise(stream).then(() => {
  console.log('✅ Sitemap generated at public/sitemap.xml');
}).catch(err => {
  console.error('❌ Error generating sitemap:', err);
  process.exit(1);
});
