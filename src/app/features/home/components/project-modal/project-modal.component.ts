import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '@data/projectData';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen && project"
      @fadeIn
      class="fixed inset-0 z-[200] overflow-y-auto bg-black/90"
      (click)="onBackdropClick($event)"
    >
      <div class="relative min-h-screen flex items-center justify-center p-4" (click)="onBackdropClick($event)">
        <div class="relative bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <!-- Close Button -->
          <button
            type="button"
            class="sticky top-4 right-4 float-right z-10 rounded-lg bg-background/80 p-2 text-foreground transition-all hover:bg-accent"
            (click)="close()"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>

          <!-- Project Content -->
          <div class="p-8">
            <!-- Project Image -->
            <div class="mb-6 rounded-lg overflow-hidden">
              <img
                [src]="project.imgUrl"
                [alt]="project.title"
                class="w-full h-auto object-cover"
                loading="eager"
              />
            </div>

            <!-- Project Title -->
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {{ project.title }}
            </h2>

            <!-- Project Description -->
            <p class="text-lg text-muted-foreground mb-6 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Technologies -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-foreground">Technologies</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let tech of project.details.technologies"
                  class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Features -->
            <div *ngIf="project.details.features.length > 0" class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-foreground">Features</h3>
              <ul class="space-y-3">
                <li
                  *ngFor="let feature of project.details.features"
                  class="flex items-start gap-2 text-muted-foreground"
                >
                  <svg class="w-5 h-5 mt-0.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-foreground">{{ feature.title }}</div>
                    <div class="text-sm">{{ feature.text }}</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Challenges -->
            <div *ngIf="project.details.challenges.length > 0" class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-foreground">Challenges</h3>
              <ul class="space-y-3">
                <li
                  *ngFor="let challenge of project.details.challenges"
                  class="flex items-start gap-2 text-muted-foreground"
                >
                  <svg class="w-5 h-5 mt-0.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <div>
                    <div class="font-medium text-foreground">{{ challenge.title }}</div>
                    <div class="text-sm">{{ challenge.text }}</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Learnings -->
            <div *ngIf="project.details.learnings.length > 0" class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-foreground">Key Learnings</h3>
              <div class="space-y-4">
                <div *ngFor="let learning of project.details.learnings">
                  <h4 class="font-medium text-foreground mb-2">{{ learning.title }}</h4>
                  <ul class="space-y-2 ml-4">
                    <li
                      *ngFor="let point of learning.points"
                      class="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <svg class="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      <span>{{ point.text }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div class="flex flex-wrap gap-4 pt-6 border-t border-border">
              <a
                *ngIf="project.repoUrl"
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
              <a
                *ngIf="project.liveUrl"
                [href]="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProjectModalComponent implements OnChanges {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  private scrollY = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      setTimeout(() => {
        if (this.isOpen) {
          this.preventBodyScroll();
        } else {
          this.allowBodyScroll();
        }
      }, 0);
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.allowBodyScroll();
    this.closeEvent.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private preventBodyScroll(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = '100%';
    }
  }

  private allowBodyScroll(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const scrollY = this.scrollY;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
      });
    }
  }
}
