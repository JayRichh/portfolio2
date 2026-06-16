import { Component, signal, computed, OnInit, HostListener, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeSelectorComponent } from '@shared/components/ui/theme-selector/theme-selector.component';

interface NavLink {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeSelectorComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly mobileMenuOpen = signal(false);
  readonly currentRoute = signal<string>('');
  readonly scrollY = signal(0);
  readonly viewportHeight = signal(0);

  readonly isHomePage = computed(() => this.currentRoute() === '/');
  readonly shouldShowHeader = computed(() => {
    if (!this.isHomePage()) {
      return true;
    }
    return this.scrollY() > this.viewportHeight();
  });

  readonly navLinks: readonly NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Code', path: '/code' },
    { label: 'Featured', path: '/work' },
    { label: 'Contact', path: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollY.set(window.scrollY);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.viewportHeight.set(window.innerHeight);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.scrollY.set(window.scrollY);
      this.viewportHeight.set(window.innerHeight);
    }

    this.currentRoute.set(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute.set(event.url);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
