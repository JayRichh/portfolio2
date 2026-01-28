import { Component, signal, effect, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { projectData, Project } from '@data/projectData';
import { ProjectService } from '../../../../core/services/project.service';
import { MetaService } from '../../../../core/services/meta.service';
import { FilterSectionComponent } from '../../components/filter-section.component';
import { ProjectGridComponent } from '../../components/project-grid.component';
import { ProjectDetailDialogComponent } from '../../components/project-detail-dialog.component';
import { CODE_CONSTANTS, PAGE_METADATA } from '../../constants/code.constants';

@Component({
  selector: 'app-code-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterSectionComponent,
    ProjectGridComponent,
    ProjectDetailDialogComponent,
  ],
  template: `
    <div class="min-h-screen bg-background pt-24 md:pt-32">
      <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header class="mb-8 text-center">
          <h1 class="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
            Projects
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
            few things to look at
          </p>

          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <a
              [href]="CODE_CONSTANTS.EXTERNAL_LINKS.CODEPEN"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
              CodePen
            </a>
            <a
              [href]="CODE_CONSTANTS.EXTERNAL_LINKS.GITHUB"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
              GitHub
            </a>
          </div>
        </header>

        <app-filter-section
          [selectedTech]="selectedTech()"
          [isDropdownOpen]="isDropdownOpen()"
          [sortByRecent]="sortByRecent()"
          (toggleTech)="toggleTechFilter($event)"
          (dropdownOpenChange)="setDropdownOpen($event)"
          (sortChange)="setSortByRecent($event)"
        />

        <app-project-grid
          [isLoading]="isLoading()"
          [filteredProjects]="filteredProjects()"
          [shouldAnimate]="projectService.shouldAnimate()"
          [mounted]="mounted()"
          (selectProject)="selectProject($event)"
        />

        <app-project-detail-dialog
          [project]="selectedProject()"
          [isOpen]="!!selectedProject()"
          (closeDialog)="closeProjectDialog()"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CodePageComponent implements OnInit {
  readonly CODE_CONSTANTS = CODE_CONSTANTS;
  readonly PAGE_METADATA = PAGE_METADATA;

  readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly metaService = inject(MetaService);

  readonly mounted = signal(false);
  readonly selectedTech = this.projectService.selectedTech;
  readonly selectedProject = signal<Project | null>(null);
  readonly isDropdownOpen = signal(false);
  readonly sortByRecent = this.projectService.sortByRecent;
  readonly isLoading = signal(false);

  readonly filteredProjects = this.projectService.filteredProjects;

  constructor() {
    effect(() => {
      if (this.selectedProject()) {
        this.updateRouteHash(this.selectedProject()!.title);
      }
    });
  }

  ngOnInit(): void {
    this.metaService.updatePageMetadata({
      title: 'Projects',
      description: 'Web development projects showcasing Angular, React, TypeScript, and various modern web technologies.',
      keywords: 'projects, web development, portfolio, Angular projects, React projects',
      ogTitle: 'Code Projects - Jayden Richardson',
      ogDescription: 'Browse my web development project portfolio',
      ogImage: 'https://jayrich.dev/images/og-code.png',
      canonical: '/code'
    });

    const hasState = this.projectService.loadState();

    if (hasState) {
      this.projectService.markReturnNavigation();
      this.mounted.set(true);
      this.isLoading.set(false);
    } else {
      this.projectService.markFreshNavigation();
      this.isLoading.set(true);

      setTimeout(() => {
        this.mounted.set(true);
        this.isLoading.set(false);
      }, CODE_CONSTANTS.LOADING.INITIAL_DELAY);
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      const project = projectData.find(
        p => this.slugify(p.title) === hash
      );
      if (project) {
        this.selectedProject.set(project);
      }
    }

    this.projectService.preloadTopImages(6);
  }

  toggleTechFilter(tech: string): void {
    const current = this.selectedTech();
    if (current.includes(tech)) {
      this.projectService.setSelectedTech(current.filter(t => t !== tech));
    } else {
      this.projectService.setSelectedTech([...current, tech]);
    }
  }

  setDropdownOpen(isOpen: boolean): void {
    this.isDropdownOpen.set(isOpen);
  }

  setSortByRecent(sort: boolean): void {
    this.projectService.setSortByRecent(sort);
  }

  selectProject(project: Project): void {
    this.selectedProject.set(project);
  }

  closeProjectDialog(): void {
    this.selectedProject.set(null);
    this.clearRouteHash();
  }

  private updateRouteHash(title: string): void {
    const slug = this.slugify(title);
    const path = this.location.path().split('#')[0];
    this.location.replaceState(`${path}#${slug}`);
  }

  private clearRouteHash(): void {
    const path = this.location.path().split('#')[0];
    this.location.replaceState(path);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
