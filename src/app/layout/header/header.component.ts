import { Component, signal, computed, OnInit, HostListener, inject } from '@angular/core';
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

  readonly mobileMenuOpen = signal(false);
  readonly currentRoute = signal<string>('');
  readonly scrollY = signal(0);
  readonly viewportHeight = signal(0);

  readonly isHomePage = computed(() => this.currentRoute() === '/');
  readonly shouldShowHeader = computed(() => {
    // Always show header on non-home pages
    if (!this.isHomePage()) {
      return true;
    }
    // On home page, only show after scrolling past first viewport
    return this.scrollY() > this.viewportHeight();
  });

  readonly navLinks: readonly NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Code', path: '/code' },
    { label: 'Featured', path: '/work' },
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
    // Set initial state FIRST to prevent flash
    if (typeof window !== 'undefined') {
      this.scrollY.set(window.scrollY);
      this.viewportHeight.set(window.innerHeight);
    }

    // Set initial route immediately
    this.currentRoute.set(this.router.url);

    // Subscribe to router events to track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
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
