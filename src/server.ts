import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './main.server';
import { RESPONSE_INIT, ResponseState } from './app/core/tokens/response.token';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get(/.*/,express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }));

  server.get(/.*/,(req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const responseState: ResponseState = {};

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: RESPONSE_INIT, useValue: responseState }
        ]
      })
      .then((html) => res.status(responseState.status ?? 200).send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

const isDirectRun = process.argv[1]
  ? resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])
  : false;

if (isDirectRun) {
  run();
}
