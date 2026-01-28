import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopSectionComponent } from '../../components/top-section/top-section.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { HobbiesComponent } from '../../components/hobbies/hobbies.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { ScrollIndicatorComponent } from '../../components/scroll-indicator/scroll-indicator.component';
import { MetaService } from '../../../../core/services/meta.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TopSectionComponent,
    TimelineComponent,
    HobbiesComponent,
    SocialLinksComponent,
    ScrollIndicatorComponent
  ],
  template: `
    <div class="about-page">
      <app-top-section />
      <app-timeline />
      <app-hobbies />
      <app-social-links />

      <section class="footer-navigation">
        <div class="footer-container">
          <h2 class="footer-title">Explore More</h2>
          <div class="footer-links">
            <a routerLink="/code" class="footer-link footer-link-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              View My Projects
            </a>
            <a routerLink="/work" class="footer-link footer-link-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Work Experience
            </a>
          </div>
        </div>
      </section>

      <app-scroll-indicator />
    </div>
  `,
  styles: [`
    .about-page {
      position: relative;
      min-height: 100vh;
      background: hsl(var(--background));
      overflow-x: hidden;
    }

    .footer-navigation {
      width: 100%;
      position: relative;
      background: hsl(var(--background));
      padding: 6rem 1rem;
    }

    @media (min-width: 640px) {
      .footer-navigation {
        padding: 8rem 2rem;
      }
    }

    @media (min-width: 1024px) {
      .footer-navigation {
        padding: 10rem 4rem;
      }
    }

    @media (max-width: 768px) {
      .footer-navigation {
        margin-bottom: 10vh;
      }
    }

    .footer-container {
      max-width: 60rem;
      margin: 0 auto;
      text-align: center;
    }

    .footer-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      color: hsl(var(--foreground));
      letter-spacing: -0.02em;
    }

    @media (min-width: 640px) {
      .footer-title {
        font-size: 3rem;
      }
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 24rem;
      margin: 0 auto;
    }

    @media (min-width: 640px) {
      .footer-links {
        flex-direction: row;
        justify-content: center;
        max-width: none;
        gap: 2rem;
      }
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      min-height: 3.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .footer-link-primary {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }

    .footer-link-primary:hover {
      background: hsl(var(--primary) / 0.9);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15);
    }

    .footer-link-secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }

    .footer-link-secondary:hover {
      background: hsl(var(--secondary) / 0.9);
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15);
    }

    .footer-link:active {
      transform: scale(0.98);
    }

    .footer-link svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .footer-link {
        transition: none;
      }

      .footer-link:hover {
        transform: none;
      }
    }
  `]
})
export class AboutPageComponent implements OnInit {
  private readonly metaService = inject(MetaService);

  ngOnInit(): void {
    this.metaService.updatePageMetadata({
      title: 'About',
      description: 'Learn about my journey as a full stack developer, tech stack expertise, and professional experience in modern web development.',
      keywords: 'about, developer bio, tech stack, professional experience',
      ogTitle: 'About Jayden Richardson',
      ogDescription: 'Full stack developer with expertise in Angular, React, Node.js, and cloud technologies',
      ogImage: 'https://jayrich.dev/images/og-about.png',
      canonical: '/about'
    });
  }
}
