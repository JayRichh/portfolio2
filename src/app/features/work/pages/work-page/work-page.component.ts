import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { projectsData } from '@data/workProjects';
import { HeroSectionComponent } from '../../components/hero-section.component';
import { TechBadgeComponent } from '@features/code/components/tech-badge.component';
import { ScrollIndicatorComponent } from '@features/about/components/scroll-indicator/scroll-indicator.component';
import { MetaService } from '../../../../core/services/meta.service';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroSectionComponent, TechBadgeComponent, ScrollIndicatorComponent],
  template: `
    <div class="work-page">
      <div class="scroll-progress" [style.width.%]="scrollProgress()"></div>
      <app-hero-section />

      <section
        *ngFor="let project of projects; let i = index"
        class="project-section"
        [class.reverse]="project.reverse"
      >
        <div class="project-content">
          <div class="project-inner" [ngClass]="getProjectBackgroundClass(project.title)">
            <div class="project-container">
              <div class="project-grid" [class.project-reverse]="project.reverse">
                <div class="project-images">
                  <div class="main-image-wrapper">
                    <img
                      [src]="project.mainImage.src"
                      [alt]="project.mainImage.alt"
                      class="main-image"
                      loading="lazy"
                    />
                  </div>

                  <div class="sub-images" *ngIf="project.subImages.length > 0">
                    <div
                      *ngFor="let image of project.subImages"
                      class="sub-image-wrapper"
                    >
                      <img
                        [src]="image.src"
                        [alt]="image.alt"
                        class="sub-image"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <div class="project-details">
                  <div class="details-header">
                    <h2 class="project-title" [ngClass]="getProjectTitleClass(project.title)">
                      {{ project.title }}
                    </h2>

                    <p class="project-description">
                      {{ project.description }}
                    </p>

                    <div class="project-tech">
                      <app-tech-badge
                        *ngFor="let tech of project.technologies"
                        [tech]="tech"
                        [isClickable]="false"
                      />
                    </div>
                  </div>

                  <div class="details-footer">
                    <div class="project-links">
                      <a
                        *ngIf="project.links.live"
                        [href]="project.links.live"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link project-link-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" x2="21" y1="14" y2="3"/>
                        </svg>
                        View Live Demo
                      </a>

                      <a
                        *ngIf="project.links.code"
                        [href]="project.links.code"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link project-link-secondary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                          <path d="M9 18c-4.51 2-5-2-7-2"/>
                        </svg>
                        View Repository
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <app-scroll-indicator />

      <section class="navigation-section">
        <div class="navigation-container">
          <h2 class="navigation-title">Explore More</h2>
          <div class="navigation-buttons">
            <a routerLink="/about" class="nav-button nav-button-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              About Me
            </a>

            <a routerLink="/code" class="nav-button nav-button-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              Projects
            </a>

            <a href="/" (click)="scrollToContact($event)" class="nav-button nav-button-tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .work-page {
      position: relative;
      background: hsl(var(--background));
    }

    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: hsl(var(--primary));
      z-index: 1000;
      transition: width 0.1s ease-out;
      opacity: 0.7;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-progress {
        transition: none;
      }
    }

    .project-section {
      position: relative;
      width: 100%;
      padding: 0;
    }

    .project-section:first-child {
      padding-top: 4rem;
    }

    .project-content {
      position: relative;
      min-height: auto;
      width: 100%;
      padding: 0;
    }

    .project-inner {
      position: relative;
      height: 100%;
      width: 100%;
      background: hsl(var(--background));
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.6s ease;
      padding: 4rem 0;
    }

    .bg-indigo {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(99 102 241 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-indigo::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 50%, rgb(99 102 241 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-blue {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(59 130 246 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-blue::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 50%, rgb(59 130 246 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-purple {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(168 85 247 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-purple::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 30%, rgb(168 85 247 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-emerald {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(16 185 129 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-emerald::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 30%, rgb(16 185 129 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-emerald-alt {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(52 211 153 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-emerald-alt::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgb(52 211 153 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-teal {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(20 184 166 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-teal::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 70%, rgb(20 184 166 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-green {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(34 197 94 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-green::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 70%, rgb(34 197 94 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-sky {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(14 165 233 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-sky::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 30%, rgb(14 165 233 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-violet {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(139 92 246 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-violet::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 50%, rgb(139 92 246 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .bg-red {
      background: linear-gradient(135deg,
        hsl(var(--background)) 0%,
        rgb(239 68 68 / 0.03) 50%,
        hsl(var(--background)) 100%);
    }

    .bg-red::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 30% 50%, rgb(239 68 68 / 0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    .project-container {
      max-width: 90rem;
      width: 100%;
      padding: 1rem;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 640px) {
      .project-container {
        padding: 2rem;
      }
    }

    @media (min-width: 1024px) {
      .project-container {
        padding: 4rem;
      }
    }

    .project-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: stretch;
    }

    @media (min-width: 1024px) {
      .project-grid {
        grid-template-columns: repeat(12, 1fr);
        gap: 4rem;
      }
    }

    .project-images {
      grid-column: span 1;
    }

    @media (min-width: 1024px) {
      .project-images {
        grid-column: span 6;
      }

      .project-reverse .project-images {
        order: 2;
      }
    }

    .main-image-wrapper {
      overflow: hidden;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
      border: 1px solid hsl(var(--border) / 0.5);
      transition: all 0.3s ease;
    }

    .main-image-wrapper:hover {
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15),
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
      border-color: hsl(var(--border));
    }

    @media (min-width: 768px) {
      .main-image-wrapper {
        margin-bottom: 2rem;
      }
    }

    .main-image {
      width: 100%;
      height: 30vh;
      min-height: 240px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .main-image {
        height: 45vh;
      }
    }

    .main-image:hover {
      transform: scale(1.05);
    }

    .sub-images {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .sub-images {
        gap: 2rem;
      }
    }

    .sub-image-wrapper {
      overflow: hidden;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
      border: 1px solid hsl(var(--border) / 0.5);
      transition: all 0.3s ease;
    }

    .sub-image-wrapper:hover {
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15),
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
      border-color: hsl(var(--border));
    }

    .sub-image {
      width: 100%;
      height: 15vh;
      min-height: 120px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    @media (min-width: 768px) {
      .sub-image {
        height: 22vh;
      }
    }

    .sub-image:hover {
      transform: scale(1.05);
    }

    .project-details {
      grid-column: span 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      background: hsl(var(--card) / 0.5);
      border-radius: 0.75rem;
      border: 1px solid hsl(var(--border) / 0.3);
      backdrop-filter: blur(8px);
    }

    @media (min-width: 1024px) {
      .project-details {
        grid-column: span 6;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2.5rem;
        gap: 0;
      }

      .project-reverse .project-details {
        order: 1;
      }
    }

    .details-header {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .details-footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .project-title {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.025em;
    }

    @media (min-width: 640px) {
      .project-title {
        font-size: 3rem;
      }
    }

    @media (min-width: 768px) {
      .project-title {
        font-size: 3.75rem;
      }
    }

    .project-description {
      font-size: 1.125rem;
      line-height: 1.75;
      color: hsl(var(--muted-foreground));
    }

    @media (min-width: 640px) {
      .project-description {
        font-size: 1.25rem;
      }
    }

    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .project-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .project-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      transition: all 0.2s;
      text-decoration: none;
    }

    .project-link:active {
      transform: scale(0.95);
    }

    .project-link-primary {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }

    .project-link-primary:hover {
      background: hsl(var(--primary) / 0.9);
    }

    .project-link-secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }

    .project-link-secondary:hover {
      background: hsl(var(--secondary) / 0.8);
    }

    .navigation-section {
      position: relative;
      background: hsl(var(--background));
      padding: 6rem 1rem;
    }

    @media (min-width: 640px) {
      .navigation-section {
        padding: 8rem 2rem;
      }
    }

    @media (min-width: 1024px) {
      .navigation-section {
        padding: 10rem 4rem;
      }
    }

    .navigation-container {
      max-width: 60rem;
      margin: 0 auto;
      text-align: center;
    }

    .navigation-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 3rem;
      color: hsl(var(--foreground));
      letter-spacing: -0.02em;
    }

    @media (min-width: 640px) {
      .navigation-title {
        font-size: 3rem;
      }
    }

    .navigation-buttons {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 24rem;
      margin: 0 auto;
    }

    @media (min-width: 640px) {
      .navigation-buttons {
        flex-direction: row;
        justify-content: center;
        max-width: none;
        gap: 2rem;
      }
    }

    .nav-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      border: 2px solid transparent;
      min-height: 3.5rem;
    }

    .nav-button:active {
      transform: scale(0.98);
    }

    .nav-button svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-button-primary {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .nav-button-primary:hover {
      background: hsl(var(--primary) / 0.9);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15);
      transform: translateY(-2px);
    }

    .nav-button-secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .nav-button-secondary:hover {
      background: hsl(var(--secondary) / 0.9);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15);
      transform: translateY(-2px);
    }

    .nav-button-tertiary {
      background: hsl(var(--card));
      color: hsl(var(--foreground));
      border-color: hsl(var(--border));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .nav-button-tertiary:hover {
      background: hsl(var(--card) / 0.9);
      border-color: hsl(var(--primary));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15);
      transform: translateY(-2px);
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-button {
        transition: none;
      }

      .nav-button:hover {
        transform: none;
      }
    }
  `]
})
export class WorkPageComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);

  readonly projects = projectsData;
  readonly scrollProgress = signal(0);

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
