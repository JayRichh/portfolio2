import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'earthy-luxe' | 'classic-green' | 'desert-warmth';
export type Mode = 'light' | 'dark';

export interface ThemeState {
  readonly theme: Theme;
  readonly mode: Mode;
}

const THEME_CLASS_MAP: Record<Theme, string> = {
  'earthy-luxe': '',
  'classic-green': 'theme-classic',
  'desert-warmth': 'theme-desert'
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  private readonly MODE_KEY = 'portfolio-mode';

  readonly theme = signal<Theme>(this.getInitialTheme());
  readonly mode = signal<Mode>(this.getInitialMode());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme(), this.mode());
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    localStorage.setItem(this.MODE_KEY, mode);
  }

  toggleMode(): void {
    this.setMode(this.mode() === 'light' ? 'dark' : 'light');
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    return (stored as Theme) || 'earthy-luxe';
  }

  private getInitialMode(): Mode {
    const stored = localStorage.getItem(this.MODE_KEY);
    if (stored) {
      return stored as Mode;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private applyTheme(theme: Theme, mode: Mode): void {
    const html = document.documentElement;

    html.classList.remove('theme-classic', 'theme-desert', 'light', 'dark');

    const themeClass = THEME_CLASS_MAP[theme];
    if (themeClass) {
      html.classList.add(themeClass);
    }
    html.classList.add(mode);
  }
}
