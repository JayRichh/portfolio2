import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HeroQuadrantComponent } from '../../components/hero-quadrant/hero-quadrant.component';
import { FrameworkShowcaseComponent } from '../../components/framework-showcase/framework-showcase.component';
import { ContactFormComponent } from '@shared/components/feature/contact-form/contact-form.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { projectData, Project } from '@data/projectData';
import { BrowserPlatformService } from '@core/services/browser-platform.service';

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
      background: hsl(var(--background));
    }

    .contact-section {
      width: 80%;
      background: hsl(var(--card));
      margin: 4rem auto 3px auto;
      padding: 3rem 1.25rem 3.5rem;
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
  private readonly platform = inject(BrowserPlatformService);

  readonly selectedProject = signal<Project | null>(null);
  readonly isModalOpen = signal(false);

  ngOnInit(): void {
    if (!this.platform.isBrowser) return;
    this.checkHash();
    window.addEventListener('hashchange', () => this.checkHash());
  }

  private checkHash(): void {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const slug = hash.substring(9);
      const project = projectData.find(p => p.slug === slug);
      if (project) {
        this.selectedProject.set(project);
        this.isModalOpen.set(true);
      }
    }
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);
    this.isModalOpen.set(true);
    const hash = `#project-${project.slug}`;
    this.location.go(this.location.path().split('#')[0] + hash);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedProject.set(null);
    this.location.go(this.location.path().split('#')[0]);
  }
}
