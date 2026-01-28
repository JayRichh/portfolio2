import { Component, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@data/projectData';
import { TechBadgeComponent } from './tech-badge.component';
import { CODE_CONSTANTS } from '../constants/code.constants';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent],
  template: `
    <div
      class="group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-lg cursor-pointer flex flex-col w-full"
      (click)="onProjectSelect()"
    >
      <div class="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          [src]="project.imgUrl"
          [alt]="project.title"
          class="h-full w-full object-cover transition-opacity duration-500"
          [class.opacity-100]="imageLoaded()"
          [class.opacity-0]="!imageLoaded()"
          (load)="onImageLoad()"
          (error)="onImageError()"
          loading="lazy"
        />
        <div
          *ngIf="!imageLoaded() && !imageError()"
          class="absolute inset-0 flex items-center justify-center bg-muted"
        >
          <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
        <div
          *ngIf="imageError()"
          class="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
        >
          <span>Image unavailable</span>
        </div>

        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div class="flex flex-wrap gap-2">
            <button
              *ngIf="project.liveUrl"
              class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              (click)="openLink($event, project.liveUrl)"
            >
              <span class="hidden xs:inline">Live Demo</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" x2="21" y1="14" y2="3"/>
              </svg>
            </button>

            <button
              *ngIf="project.repoUrl"
              class="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
              (click)="openLink($event, project.repoUrl)"
            >
              <span class="hidden xs:inline">Repository</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </button>

            <button
              class="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-all hover:bg-accent/80 active:scale-95"
              (click)="onProjectSelect()"
            >
              <span class="hidden xs:inline">Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 xs:p-6 flex flex-col flex-1">
        <h3 class="mb-2 line-clamp-1 text-xl font-semibold text-foreground">
          {{ project.title }}
        </h3>
        <p class="mb-4 line-clamp-2 text-sm text-muted-foreground flex-1">
          {{ project.description }}
        </p>

        <div class="flex flex-wrap gap-2">
          <app-tech-badge
            *ngFor="let tech of displayTechnologies"
            [tech]="tech"
            [isClickable]="false"
          />
          <span
            *ngIf="remainingTechCount > 0"
            class="inline-flex items-center px-3 py-1.5 text-xs text-muted-foreground"
          >
            +{{ remainingTechCount }} more
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
    }
  `]
})
export class ProjectCardComponent implements OnInit {
  @Input() project!: Project;
  @Input() index = 0;
  @Output() selectProject = new EventEmitter<Project>();

  private readonly projectService = inject(ProjectService);

  readonly imageLoaded = signal(false);
  readonly imageError = signal(false);

  ngOnInit(): void {
    if (this.projectService.isImageLoaded(this.project.imgUrl)) {
      this.imageLoaded.set(true);
    }
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
    this.projectService.markImageLoaded(this.project.imgUrl);
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  get displayTechnologies(): string[] {
    return this.project.details.technologies.slice(0, CODE_CONSTANTS.DISPLAY.TECH_LIMIT);
  }

  get remainingTechCount(): number {
    const total = this.project.details.technologies.length;
    const displayed = CODE_CONSTANTS.DISPLAY.TECH_LIMIT;
    return Math.max(0, total - displayed);
  }

  onProjectSelect(): void {
    this.selectProject.emit(this.project);
  }

  openLink(event: Event, url: string): void {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
