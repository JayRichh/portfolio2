import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app.config';

const serverOnlyConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations()
  ]
};

export const serverConfig = mergeApplicationConfig(appConfig, serverOnlyConfig);
