import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { projectsData } from '@data/workProjects';
import { HeroSectionComponent } from '../../components/hero-section.component';
import { TechBadgeComponent } from '@features/code/components/tech-badge.component';
import { ScrollIndicatorComponent } from '@features/about/components/scroll-indicator/scroll-indicator.component';
import { ExploreNavComponent, ExploreNavLink } from '@shared/components/feature/explore-nav/explore-nav.component';
import { MetaService } from '../../../../core/services/meta.service';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent, TechBadgeComponent, ScrollIndicatorComponent, ExploreNavComponent],
  templateUrl: './work-page.component.html',
  styleUrl: './work-page.component.scss'
})
export class WorkPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);

  readonly projects = projectsData;
  readonly scrollProgress = signal(0);

  readonly navLinks: ExploreNavLink[] = [
    {
      label: 'About Me',
      route: '/about',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      variant: 'primary'
    },
    {
      label: 'Projects',
      route: '/code',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      variant: 'secondary'
    },
    {
      label: 'Get In Touch',
      route: '/',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      variant: 'tertiary',
      onClick: (event: Event) => this.scrollToContact(event)
    }
  ];

  ngOnInit(): void {
    this.metaService.updatePageMetadata({
      title: 'Work Experience',
      description: 'Professional work history and projects completed across various industries and technologies.',
      keywords: 'work experience, professional projects, portfolio',
      ogTitle: 'Work Experience - Jayden Richardson',
      ogDescription: 'View my professional work history and project contributions',
      ogImage: 'https://jayrich.dev/images/og-work.png',
      canonical: '/work'
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  private readonly onScroll = (): void => {
    const scrolled = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const progress = Math.min(
      (scrolled / (documentHeight - viewportHeight)) * 100,
      100
    );

    this.scrollProgress.set(progress);
  };

  scrollToContact(event: Event): void {
    event.preventDefault();

    this.router.navigate(['/']).then(() => {
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const documentHeight = document.documentElement.scrollHeight;
          const viewportHeight = window.innerHeight;
          const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
          const offset = 2 * remInPixels;
          const scrollTarget = documentHeight - viewportHeight - offset;

          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }, 100);
      }
    });
  }

  getProjectTitleClass(title: string): string {
    const colorMap: Record<string, string> = {
      'Checkpoint': 'text-indigo-600 dark:text-indigo-400',
      'SteamShare': 'text-blue-600 dark:text-blue-400',
      'CSS Battle': 'text-purple-600 dark:text-purple-400',
      'Golf2Go': 'text-emerald-600 dark:text-emerald-400',
      'Encompass Tours': 'text-teal-600 dark:text-teal-400',
      'Riddlit': 'text-emerald-600 dark:text-emerald-400',
      'Trekk': 'text-green-600 dark:text-green-400',
      'Elite Garage Screens': 'text-blue-600 dark:text-blue-400',
      'Next.js Template': 'text-violet-600 dark:text-violet-400',
      'POE2 Tools': 'text-red-600 dark:text-red-400'
    };

    return colorMap[title] || '';
  }

  getProjectBackgroundClass(title: string): string {
    const bgMap: Record<string, string> = {
      'Checkpoint': 'bg-indigo',
      'SteamShare': 'bg-blue',
      'CSS Battle': 'bg-purple',
      'Golf2Go': 'bg-emerald',
      'Encompass Tours': 'bg-teal',
      'Riddlit': 'bg-emerald-alt',
      'Trekk': 'bg-green',
      'Elite Garage Screens': 'bg-sky',
      'Next.js Template': 'bg-violet',
      'POE2 Tools': 'bg-red'
    };

    return bgMap[title] || '';
  }
}
