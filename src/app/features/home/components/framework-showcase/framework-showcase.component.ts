import { Component, signal, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { projectData, Project } from '@data/projectData';
import { groupProjectsByFramework } from '@data/techUtils';
import { ImageTooltipComponent } from '@shared/components/ui/image-tooltip/image-tooltip.component';
import { ScrollIndicatorComponent } from '@features/about/components/scroll-indicator/scroll-indicator.component';

interface FrameworkGroup {
  readonly framework: string;
  readonly projects: readonly Project[];
  readonly totalCount: number;
}

@Component({
  selector: 'app-framework-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageTooltipComponent, ScrollIndicatorComponent],
  template: `
    <section class="framework-showcase">
      <div class="showcase-container">
        <div class="showcase-header">
          <h2 class="showcase-title">Projects</h2>
          <span class="project-count">({{ totalProjects() }})</span>
        </div>

        <div *ngFor="let group of frameworkGroups()" class="framework-section">
          <hr class="section-divider" />
          <div class="section-layout">
            <div class="section-category">
              <h3 class="category-label">{{ group.framework }}</h3>
            </div>

            <div class="section-content">
              <div class="project-list">
                <a
                  *ngFor="let project of group.projects"
                  href="#"
                  class="project-item"
                  (click)="onProjectClick($event, project)"
                  (mouseenter)="onProjectHover(project, $event)"
                  (mousemove)="onProjectMove($event)"
                  (mouseleave)="onProjectLeave()"
                >
                  <span class="project-name">{{ project.title }}</span>
                  <svg class="project-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <app-image-tooltip />
      <app-scroll-indicator />
    </section>
  `,
  styles: [`
    .framework-showcase {
      width: 100%;
      padding: 0;
      background: hsl(var(--background));
      min-height: 100vh;
    }

    .showcase-container {
      width: 100%;
      max-width: none;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .showcase-header {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      padding: 0 2rem 2rem;
    }

    @media (min-width: 768px) {
      .showcase-header {
      }
    }

    .showcase-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      color: hsl(var(--foreground));
      margin: 0;
      text-align: left;
    }

    .project-count {
      font-size: clamp(1rem, 2vw, 1rem);
      color: hsl(var(--muted-foreground));
      font-weight: 300;
    }

    .framework-section {
      margin-bottom: 5rem;
    }

    .framework-section:last-child {
      margin-bottom: 0;
    }

    .section-divider {
      width: 100%;
      height: 1px;
      background: hsl(var(--border));
      border: none;
      margin: 0 0 -1px 0;
    }

    @media (min-width: 768px) {
      .section-divider {
        margin-bottom: -1px;
      }
    }

    .section-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin: 0;
    }

    @media (min-width: 768px) {
      .section-layout {
        grid-template-columns: 1fr 1fr;
        gap: 0;
        padding: 0;
      }
    }

    .section-category {
      position: relative;
    }

    @media (min-width: 768px) {
      .section-category {
        position: sticky;
        top: 120px;
        align-self: start;
        padding-left: 2rem;
        padding-right: 4rem;
        text-align: right;
      }
    }

    .category-label {
      font-size: clamp(1.25rem, 2vw, 1.5rem);
      font-weight: 400;
      color: hsl(var(--muted-foreground));
      margin: 0;
      text-transform: capitalize;
      letter-spacing: -0.01em;
      margin-top: 1rem;
    }

    .section-content {
      width: 100%;
      padding: 0 2rem;
    }

    @media (min-width: 768px) {
      .section-content {
        padding-left: 4rem;
        padding-right: 2rem;
      }
    }

    .project-list {
      display: flex;
      flex-direction: column;
      margin: 0 -2rem;
      padding: 0;
    }

    @media (min-width: 768px) {
      .project-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 3rem;
        row-gap: 0;
        margin: 0 -2rem;
      }
    }

    .project-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      border-top: 1px solid hsl(var(--border) / 0.5);
      text-decoration: none;
      color: hsl(var(--foreground));
      transition: all 0.2s ease;
      position: relative;
      cursor: pointer;
    }

    .project-item img {
      width: 1rem;
      height: 1rem;

    }

    .project-item:hover {
      border-bottom-color: hsl(var(--foreground));
    }

    .project-item:hover .project-name {
      color: hsl(var(--foreground));
    }

    .project-item:hover .project-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .project-name {
      font-size: clamp(1.25rem, 2.5vw, 1.75rem);
      font-weight: 400;
      color: hsl(var(--foreground) / 0.8);
      transition: color 0.2s ease;
      letter-spacing: -0.01em;
    }

    .project-arrow {
      flex-shrink: 0;
      color: hsl(var(--foreground));
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.2s ease;
    }

    @media (min-width: 768px) {
      .project-item {
        padding: 1.25rem 1rem;
      }
    }

    /* Mobile Styles */
    @media (max-width: 767px) {
      .framework-showcase {
        padding: 4rem 1rem;
      }

      .showcase-header {
        margin-bottom: 4rem;
      }

      .framework-section {
        margin-bottom: 5rem;
      }

      .category-label {
        margin-bottom: 2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid hsl(var(--border));
      }

      .project-item {
        padding: 0.75rem 0;
      }
    }

    /* Focus Styles */
    .project-item:focus-visible {
      outline: 2px solid hsl(var(--primary));
      outline-offset: 4px;
      border-radius: 4px;
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .project-item,
      .project-name,
      .project-arrow {
        transition: none;
      }
    }
  `]
})
export class FrameworkShowcaseComponent implements OnInit {
  @ViewChild(ImageTooltipComponent) tooltip!: ImageTooltipComponent;
  @Output() projectClick = new EventEmitter<Project>();

  readonly frameworkGroups = signal<FrameworkGroup[]>([]);
  readonly totalProjects = signal(0);

  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private currentProject: Project | null = null;
  private currentFrameworkProjects: Project[] = [];

  ngOnInit(): void {
    const grouped = groupProjectsByFramework(projectData);
    const groups: FrameworkGroup[] = [];
    let total = 0;

    for (const [framework, projects] of grouped) {
      if (framework !== 'Other' && projects.length > 0) {
        groups.push({
          framework,
          projects,
          totalCount: projects.length
        });
        total += projects.length;
      }
    }

    this.frameworkGroups.set(groups);
    this.totalProjects.set(total);
  }

  onProjectHover(project: Project, event: MouseEvent): void {
    // Cancel pending hide if moving to another project
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
    }

    if (this.currentProject !== project) {
      this.currentProject = project;

      this.showTimeout = window.setTimeout(() => {
        if (this.tooltip && this.currentProject === project) {
          // Find which framework group this project belongs to
          const group = this.frameworkGroups().find(g =>
            g.projects.some(p => p.title === project.title)
          );

          if (group) {
            this.currentFrameworkProjects = group.projects as Project[];
            const projectIndex = this.currentFrameworkProjects.findIndex(p => p.title === project.title);

            // Create tooltip items from all projects in the framework
            const tooltipItems = this.currentFrameworkProjects.map(p => ({
              imageUrl: p.imgUrl,
              title: p.title
            }));

            this.tooltip.show(tooltipItems, projectIndex);
            this.tooltip.updatePosition(event.clientX, event.clientY);
          }
        }
      }, 100);
    } else {
      if (this.tooltip) {
        this.tooltip.updatePosition(event.clientX, event.clientY);
      }
    }
  }

  onProjectMove(event: MouseEvent): void {
    if (this.tooltip) {
      this.tooltip.updatePosition(event.clientX, event.clientY);
    }
  }

  onProjectLeave(): void {
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // Delay hide to allow cursor to move to next item without tooltip disappearing
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = window.setTimeout(() => {
      this.currentProject = null;
      if (this.tooltip) {
        this.tooltip.hide();
      }
      this.hideTimeout = null;
    }, 150);
  }

  onProjectClick(event: Event, project: Project): void {
    event.preventDefault();

    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.tooltip) {
      this.tooltip.hide();
    }

    this.projectClick.emit(project);
  }
}
 