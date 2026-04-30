import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@data/projectData';
import { TechBadgeComponent } from '@features/code/components/tech-badge.component';

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent],
  template: `
    <section class="project-overview" *ngIf="project" id="overview">
      <div class="lede">
        <p>{{ project.details.description }}</p>
      </div>
      <aside class="stats">
        <div class="stat">
          <span class="stat-label">Stack</span>
          <span class="stat-value">{{ project.details.technologies.length }}</span>
        </div>
        <div class="stat" *ngIf="project.details.features.length">
          <span class="stat-label">Features</span>
          <span class="stat-value">{{ project.details.features.length }}</span>
        </div>
        <div class="stat" *ngIf="project.details.challenges.length">
          <span class="stat-label">Challenges</span>
          <span class="stat-value">{{ project.details.challenges.length }}</span>
        </div>
      </aside>
      <div class="tech-row">
        <app-tech-badge
          *ngFor="let tech of project.details.technologies"
          [tech]="tech"
          [isClickable]="false"
        />
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .project-overview {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem 2rem;
      padding: 2rem 0;
      border-bottom: 1px solid hsl(var(--border));
    }
    @media (min-width: 768px) {
      .project-overview {
        grid-template-columns: minmax(0, 2fr) auto;
        align-items: start;
      }
      .tech-row { grid-column: 1 / -1; }
    }
    .lede p {
      font-size: clamp(1rem, 1.4vw, 1.15rem);
      line-height: 1.7;
      color: hsl(var(--foreground));
      margin: 0;
    }
    .stats {
      display: flex;
      gap: 1rem;
      align-self: start;
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: hsl(var(--muted) / 0.5);
      min-width: 80px;
    }
    .stat-label {
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: hsl(var(--muted-foreground));
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      line-height: 1;
    }
    .tech-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
  `]
})
export class ProjectOverviewComponent {
  @Input() project: Project | null = null;
}
