import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BrowserPlatformService {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly document = inject(DOCUMENT);

  readonly storage = {
    get: (key: string): string | null => {
      if (!this.isBrowser) return null;
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set: (key: string, value: string): void => {
      if (!this.isBrowser) return;
      try { localStorage.setItem(key, value); } catch {}
    },
    remove: (key: string): void => {
      if (!this.isBrowser) return;
      try { localStorage.removeItem(key); } catch {}
    }
  };

  readonly session = {
    get: (key: string): string | null => {
      if (!this.isBrowser) return null;
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set: (key: string, value: string): void => {
      if (!this.isBrowser) return;
      try { sessionStorage.setItem(key, value); } catch {}
    },
    remove: (key: string): void => {
      if (!this.isBrowser) return;
      try { sessionStorage.removeItem(key); } catch {}
    }
  };

  readonly viewport = {
    scrollY: (): number => this.isBrowser ? window.scrollY : 0,
    scrollTo: (options: ScrollToOptions): void => { if (this.isBrowser) window.scrollTo(options); },
    innerWidth: (): number => this.isBrowser ? window.innerWidth : 0,
    innerHeight: (): number => this.isBrowser ? window.innerHeight : 0,
    matchMedia: (query: string): MediaQueryList | null => this.isBrowser ? window.matchMedia(query) : null
  };

  raf(callback: FrameRequestCallback): number {
    return this.isBrowser ? window.requestAnimationFrame(callback) : 0;
  }

  cancelRaf(handle: number): void {
    if (this.isBrowser && handle) window.cancelAnimationFrame(handle);
  }
}
