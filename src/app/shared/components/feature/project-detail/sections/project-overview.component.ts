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
      <p class="lede">{{ project.details.description }}</p>
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
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      padding: 2rem 0;
      border-bottom: 1px solid hsl(var(--border));
    }
    .lede {
      font-size: clamp(1rem, 1.4vw, 1.15rem);
      line-height: 1.7;
      color: hsl(var(--foreground));
      margin: 0;
      max-width: 70ch;
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
