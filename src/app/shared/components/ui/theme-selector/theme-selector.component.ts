import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, type Theme, type Mode } from '@core/services/theme.service';

interface ThemeOption {
  readonly value: Theme;
  readonly label: string;
  readonly color: string;
}

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent {
  private readonly themeService = inject(ThemeService);

  readonly isOpen = signal(false);
  readonly theme = this.themeService.theme;
  readonly mode = this.themeService.mode;

  readonly themes: readonly ThemeOption[] = [
    { value: 'earthy-luxe', label: 'Earthy Luxe', color: 'hsl(25, 50%, 45%)' },
    { value: 'classic-green', label: 'Classic Green', color: 'hsl(158, 55%, 45%)' },
    { value: 'desert-warmth', label: 'Desert Warmth', color: 'hsl(24, 54%, 45%)' }
  ];

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  selectTheme(theme: Theme, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.themeService.setTheme(theme);
  }

  selectMode(mode: Mode, event: Event): void {
    event.stopPropagation();
    this.themeService.setMode(mode);
  }

  selectThemeAndMode(theme: Theme, mode: Mode, event: Event): void {
    event.stopPropagation();
    this.themeService.setTheme(theme);
    this.themeService.setMode(mode);
  }

  isActiveTheme(theme: Theme): boolean {
    return this.theme() === theme;
  }

  isActive(theme: Theme, mode: Mode): boolean {
    return this.theme() === theme && this.mode() === mode;
  }
}
