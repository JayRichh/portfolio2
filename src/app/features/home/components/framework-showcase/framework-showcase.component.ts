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
  templateUrl: './framework-showcase.component.html',
  styleUrl: './framework-showcase.component.scss'
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
 