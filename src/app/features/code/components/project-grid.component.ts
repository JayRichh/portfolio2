import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Project } from '@data/projectData';
import { ProjectCardComponent } from './project-card.component';
import { ProjectCardSkeletonComponent } from './project-card-skeleton.component';
import { CODE_CONSTANTS } from '../constants/code.constants';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectCardSkeletonComponent],
  template: `
    <div *ngIf="!mounted || isLoading" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-2">
      <app-project-card-skeleton
        *ngFor="let skeleton of skeletonArray"
      />
    </div>

    <div
      *ngIf="mounted && !isLoading"
      class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-2"
      [class.no-animation]="!shouldAnimate"
    >
      <div
        *ngIf="filteredProjects.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-16"
      >
        <h3 class="text-xl font-semibold text-primary">
          No Projects Found
        </h3>
        <p class="mt-2 text-muted-foreground">
          Try adjusting your filters to find more projects.
        </p>
      </div>

      <app-project-card
        *ngFor="let project of filteredProjects; trackBy: trackByTitle"
        [class.project-card-wrapper]="shouldAnimate"
        [class.project-card-wrapper-no-anim]="!shouldAnimate"
        [@fadeInUp]="shouldAnimate ? '' : null"
        [project]="project"
        [index]="0"
        (selectProject)="onSelectProject($event)"
      />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    app-project-card.project-card-wrapper {
      will-change: transform, opacity;
    }

    app-project-card.project-card-wrapper-no-anim {
      opacity: 1;
    }

    .no-animation {
      animation: none !important;
    }
  `],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(50, [
            animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProjectGridComponent {
  @Input() isLoading = false;
  @Input() filteredProjects: Project[] = [];
  @Input() shouldAnimate = true;
  @Input() mounted = true;
  @Output() selectProject = new EventEmitter<Project>();

  readonly skeletonArray = Array(CODE_CONSTANTS.GRID_BREAKPOINTS.DESKTOP * 2);

  onSelectProject(project: Project): void {
    this.selectProject.emit(project);
  }

  trackByTitle(index: number, project: Project): string {
    return project.title;
  }
}
