import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication, provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),...appConfig.providers,
    provideAnimationsAsync(),
    provideClientHydration(withNoIncrementalHydration())
  ]
}).catch(err => console.error(err));
