import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HeroQuadrantComponent } from '../../components/hero-quadrant/hero-quadrant.component';
import { FrameworkShowcaseComponent } from '../../components/framework-showcase/framework-showcase.component';
import { ContactFormComponent } from '@shared/components/feature/contact-form/contact-form.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { projectData, Project } from '@data/projectData';
import { MetaService } from '../../../../core/services/meta.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroQuadrantComponent,
    FrameworkShowcaseComponent,
    ContactFormComponent,
    ProjectModalComponent
  ],
  template: `
    <div class="home-page">
      <app-hero-quadrant />
      <app-framework-showcase (projectClick)="openProject($event)" />
      <section class="contact-section">
        <div class="contact-container">
          <h2 class="section-title">Get In Touch</h2>
          <p class="section-description">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
          <app-contact-form />
        </div>
      </section>

      <app-project-modal
        [project]="selectedProject()"
        [isOpen]="isModalOpen()"
        (closeEvent)="closeModal()"
      />
    </div>
  `,
  styles: [`
    .home-page {
      width: 100%;
      overflow-x: hidden;
      background: hsl(var(--background));
    }

    .contact-section {
      width: 80%;
      background: hsl(var(--card));
      margin: 4rem auto 3px auto;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .contact-container {
      max-width: 100%;
      max-height: 70vh;
      margin: 0 auto;
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
      color: hsl(var(--foreground));
    }

    .section-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: hsl(var(--muted-foreground));
      text-align: center;
      margin-bottom: 3rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (min-width: 640px) {
      .contact-section {
        padding: 5rem 2rem;
      }
    }

    @media (min-width: 768px) {
      .contact-section {
        padding: 6rem 3rem;
      }

      .contact-container {
        max-width: 1400px;
      }
    }

    @media (min-width: 1024px) {
      .contact-section {
        padding: 8rem 4rem;
      }

      .contact-container {
        max-width: 1600px;
      }
    }

    @media (min-width: 1536px) {
      .contact-section {
        padding: 8rem 6rem;
      }

      .contact-container {
        max-width: 1800px;
      }
    }
  `]
})
export class HomePageComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly metaService = inject(MetaService);

  readonly selectedProject = signal<Project | null>(null);
  readonly isModalOpen = signal(false);

  ngOnInit(): void {
    this.metaService.updatePageMetadata({
      title: 'Jayden Richardson | Full Stack Developer Portfolio',
      description: 'Full stack web developer specializing in Angular, React, TypeScript, and modern web technologies. View my projects and experience.',
      keywords: 'full stack developer, web developer, Angular, React, TypeScript, portfolio',
      ogTitle: 'Jayden Richardson - Full Stack Developer',
      ogDescription: 'Experienced full stack developer building modern web applications with Angular, React, and Node.js',
      ogImage: 'https://jayrich.dev/images/og-home.png',
      twitterTitle: 'Jayden Richardson | Full Stack Developer',
      twitterDescription: 'Full stack web developer portfolio - Angular, React, TypeScript',
      canonical: '/'
    });

    this.checkHash();

    window.addEventListener('hashchange', () => this.checkHash());
  }

  private checkHash(): void {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const projectTitle = decodeURIComponent(hash.substring(9));
      const project = projectData.find(p => p.title === projectTitle);
      if (project) {
        this.selectedProject.set(project);
        this.isModalOpen.set(true);
      }
    }
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);
    this.isModalOpen.set(true);
    // Update URL hash without triggering navigation
    const hash = `#project-${encodeURIComponent(project.title)}`;
    this.location.go(this.location.path().split('#')[0] + hash);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedProject.set(null);
    // Remove hash from URL
    this.location.go(this.location.path().split('#')[0]);
  }
}
