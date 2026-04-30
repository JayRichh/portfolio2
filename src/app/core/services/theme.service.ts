import { Injectable, signal, effect, inject } from '@angular/core';
import { BrowserPlatformService } from './browser-platform.service';

export type Theme = 'earthy-luxe' | 'classic-green' | 'desert-warmth';
export type Mode = 'light' | 'dark';

export interface ThemeState {
  readonly theme: Theme;
  readonly mode: Mode;
}

const THEME_KEY = 'portfolio-theme';
const MODE_KEY = 'portfolio-mode';

const THEME_CLASS_MAP: Record<Theme, string> = {
  'earthy-luxe': '',
  'classic-green': 'theme-classic',
  'desert-warmth': 'theme-desert'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platform = inject(BrowserPlatformService);

  readonly theme = signal<Theme>(this.getInitialTheme());
  readonly mode = signal<Mode>(this.getInitialMode());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme(), this.mode());
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.platform.storage.set(THEME_KEY, theme);
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.platform.storage.set(MODE_KEY, mode);
  }

  toggleMode(): void {
    this.setMode(this.mode() === 'light' ? 'dark' : 'light');
  }

  private getInitialTheme(): Theme {
    const stored = this.platform.storage.get(THEME_KEY);
    return (stored as Theme) || 'earthy-luxe';
  }

  private getInitialMode(): Mode {
    const stored = this.platform.storage.get(MODE_KEY);
    if (stored) return stored as Mode;
    return this.platform.viewport.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme, mode: Mode): void {
    if (!this.platform.isBrowser) return;
    const html = this.platform.document.documentElement;
    html.classList.remove('theme-classic', 'theme-desert', 'light', 'dark');
    const themeClass = THEME_CLASS_MAP[theme];
    if (themeClass) html.classList.add(themeClass);
    html.classList.add(mode);
  }
}
