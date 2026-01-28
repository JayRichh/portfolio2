import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkProject } from '@data/workProjects';
import { TechBadgeComponent } from '@features/code/components/tech-badge.component';

@Component({
  selector: 'app-work-card',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent],
  template: `
    <div class="relative min-h-screen bg-background">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16">
        <div
          class="grid grid-cols-1 gap-8 items-center lg:gap-16"
          [class.lg:grid-cols-12]="true"
        >
          <div
            class="lg:col-span-7"
            [class.lg:order-2]="project.reverse"
          >
            <div class="space-y-4 md:space-y-8">
              <div class="overflow-hidden rounded-lg">
                <img
                  [src]="project.mainImage.src"
                  [alt]="project.mainImage.alt"
                  class="h-[30vh] min-h-[240px] w-full object-cover transition-transform duration-300 hover:scale-105 md:h-[45vh]"
                  loading="lazy"
                />
              </div>

              <div
                *ngIf="project.subImages.length > 0"
                class="grid grid-cols-2 gap-4 md:gap-8"
              >
                <div
                  *ngFor="let image of project.subImages"
                  class="overflow-hidden rounded-lg"
                >
                  <img
                    [src]="image.src"
                    [alt]="image.alt"
                    class="h-[15vh] min-h-[120px] w-full object-cover transition-transform duration-300 hover:scale-105 md:h-[22vh]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="lg:col-span-5"
            [class.lg:order-1]="project.reverse"
          >
            <div class="space-y-6">
              <h2
                class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                [ngClass]="getProjectTitleClass()"
              >
                {{ project.title }}
              </h2>

              <p class="text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {{ project.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <app-tech-badge
                  *ngFor="let tech of project.technologies"
                  [tech]="tech"
                  [isClickable]="false"
                />
              </div>

              <div class="flex flex-wrap gap-4 pt-4">
                <a
                  *ngIf="project.links.live"
                  [href]="project.links.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" x2="21" y1="14" y2="3"/>
                  </svg>
                  View Live Demo
                </a>

                <a
                  *ngIf="project.links.code"
                  [href]="project.links.code"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  View Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class WorkCardComponent {
  @Input() project!: WorkProject;

  getProjectTitleClass(): string {
    const colorMap: Record<string, string> = {
      'Checkpoint': 'text-indigo-600 dark:text-indigo-400',
      'SteamShare': 'text-blue-600 dark:text-blue-400',
      'CSS Battle': 'text-purple-600 dark:text-purple-400',
      'Golf2Go': 'text-emerald-600 dark:text-emerald-400',
      'Encompass Tours': 'text-teal-600 dark:text-teal-400',
      'Riddlit': 'text-emerald-600 dark:text-emerald-400',
      'Trekk': 'text-green-600 dark:text-green-400',
      'Elite Garage Screens': 'text-blue-600 dark:text-blue-400',
      'Next.js Template': 'text-violet-600 dark:text-violet-400',
      'POE2 Tools': 'text-red-600 dark:text-red-400'
    };

    return colorMap[this.project.title] || 'text-foreground';
  }
}
