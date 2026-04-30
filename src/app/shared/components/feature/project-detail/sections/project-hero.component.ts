import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@data/projectData';

@Component({
  selector: 'app-project-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="project-hero" *ngIf="project">
      <div class="hero-media" (click)="imageClick.emit()">
        <img [src]="project.imgUrl" [alt]="project.title" loading="eager" />
        <div class="hero-scrim"></div>
      </div>
      <div class="hero-content">
        <div class="hero-meta">
          <span class="meta-pill">Updated {{ formatDate(project.updatedAt) }}</span>
          <span class="meta-pill primary" *ngIf="project.details.technologies[0] as primary">{{ primary }}</span>
        </div>
        <h1 class="hero-title">{{ project.details.title }}</h1>
        <p class="hero-tagline">{{ project.description }}</p>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .project-hero {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      border-radius: 0.75rem;
      min-height: clamp(280px, 38vh, 460px);
      display: flex;
      align-items: flex-end;
      background: hsl(var(--muted));
    }
    .hero-media {
      position: absolute;
      inset: 0;
      cursor: pointer;
      z-index: 0;
    }
    .hero-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hero-media:hover img { transform: scale(1.03); }
    .hero-scrim {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, transparent 0%, transparent 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%),
        linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 60%);
    }
    .hero-content {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: clamp(1.25rem, 4vw, 2.5rem);
      color: white;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .meta-pill {
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: rgba(255,255,255,0.14);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.22);
    }
    .meta-pill.primary {
      background: hsl(var(--primary) / 0.85);
      border-color: hsl(var(--primary) / 0.4);
    }
    .hero-title {
      font-size: clamp(1.75rem, 4.5vw, 2.75rem);
      font-weight: 700;
      line-height: 1.05;
      margin: 0 0 0.5rem;
      letter-spacing: -0.02em;
    }
    .hero-tagline {
      font-size: clamp(0.95rem, 1.4vw, 1.1rem);
      line-height: 1.55;
      max-width: 60ch;
      opacity: 0.9;
      margin: 0;
    }
  `]
})
export class ProjectHeroComponent {
  @Input() project: Project | null = null;
  @Output() imageClick = new EventEmitter<void>();

  formatDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
