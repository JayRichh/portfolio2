import { Component, Input, Output, EventEmitter, OnInit, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '@data/projectData';
import { TechBadgeComponent } from './tech-badge.component';
import { LightboxComponent, LightboxImage } from './lightbox.component';

@Component({
  selector: 'app-project-detail-dialog',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent, LightboxComponent],
  template: `
    <div
      *ngIf="isOpen && project"
      @fadeIn
      class="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm"
      (click)="onBackdropClick($event)"
    >
      <div
        class="min-h-screen flex items-start justify-center p-4 sm:p-8"
        (click)="onBackdropClick($event)"
      >
        <div
          @slideUp
          class="relative w-full max-w-7xl my-8 rounded-lg bg-card text-card-foreground shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <button
            type="button"
            class="absolute right-4 top-4 z-10 rounded-lg bg-background/80 p-2 text-foreground transition-all hover:bg-background"
            (click)="close()"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>

          <div
            *ngIf="isLoading()"
            class="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm"
          >
            <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>

          <div class="relative h-64 overflow-hidden rounded-t-lg bg-muted sm:h-80 md:h-96">
            <img
              [src]="project.imgUrl"
              [alt]="project.title"
              class="h-full w-full object-cover cursor-pointer transition-transform hover:scale-105"
              (click)="openLightbox(0)"
              (load)="onImageLoad()"
              (error)="onImageError()"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h2 class="text-3xl font-bold text-white sm:text-4xl">
                {{ project.details.title }}
              </h2>
            </div>
          </div>

          <div class="space-y-8 p-6 sm:p-8">
            <section>
              <p class="text-lg leading-relaxed text-foreground">
                {{ project.details.description }}
              </p>
            </section>

            <section>
              <h3 class="mb-4 text-xl font-semibold text-foreground">Technologies</h3>
              <div class="flex flex-wrap gap-2">
                <app-tech-badge
                  *ngFor="let tech of project.details.technologies"
                  [tech]="tech"
                  [isClickable]="false"
                />
              </div>
            </section>

            <section *ngIf="project.details.features.length > 0">
              <h3 class="mb-4 text-xl font-semibold text-foreground">Key Features</h3>
              <div class="grid gap-6 sm:grid-cols-2">
                <div
                  *ngFor="let feature of project.details.features"
                  class="rounded-lg border border-border bg-background p-4"
                >
                  <h4 class="mb-2 font-semibold text-foreground">{{ feature.title }}</h4>
                  <p class="text-sm leading-relaxed text-muted-foreground">{{ feature.text }}</p>
                  <img
                    *ngIf="feature.image"
                    [src]="feature.image"
                    [alt]="feature.title"
                    class="mt-4 w-full rounded-md cursor-pointer transition-transform hover:scale-[1.02]"
                    (click)="openLightboxForImage(feature.image)"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            <section *ngIf="project.details.challenges.length > 0">
              <h3 class="mb-4 text-xl font-semibold text-foreground">Challenges</h3>
              <div class="space-y-4">
                <div
                  *ngFor="let challenge of project.details.challenges"
                  class="rounded-lg border border-border bg-background p-4"
                >
                  <h4 class="mb-2 font-semibold text-foreground">{{ challenge.title }}</h4>
                  <p class="text-sm leading-relaxed text-muted-foreground">{{ challenge.text }}</p>
                  <img
                    *ngIf="challenge.image"
                    [src]="challenge.image"
                    [alt]="challenge.title"
                    class="mt-4 w-full rounded-md cursor-pointer transition-transform hover:scale-[1.02]"
                    (click)="openLightboxForImage(challenge.image)"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            <section *ngIf="project.details.learnings.length > 0">
              <h3 class="mb-4 text-xl font-semibold text-foreground">Learnings</h3>
              <div class="grid gap-6 sm:grid-cols-2">
                <div
                  *ngFor="let learning of project.details.learnings"
                  class="rounded-lg border border-border bg-background p-4"
                >
                  <h4 class="mb-3 font-semibold text-foreground">{{ learning.title }}</h4>
                  <ul class="space-y-2">
                    <li
                      *ngFor="let point of learning.points"
                      class="text-sm leading-relaxed text-muted-foreground"
                    >
                      <span class="mr-2 text-primary">•</span>
                      {{ point.text }}
                      <img
                        *ngIf="point.image"
                        [src]="point.image"
                        [alt]="point.text"
                        class="mt-2 w-full rounded-md cursor-pointer transition-transform hover:scale-[1.02]"
                        (click)="openLightboxForImage(point.image)"
                        loading="lazy"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section *ngIf="project.details.additionalImages.length > 0">
              <h3 class="mb-4 text-xl font-semibold text-foreground">Gallery</h3>
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <img
                  *ngFor="let image of project.details.additionalImages; let i = index"
                  [src]="image"
                  [alt]="'Gallery image ' + (i + 1)"
                  class="aspect-video w-full rounded-md object-cover cursor-pointer transition-transform hover:scale-105"
                  (click)="openLightboxForImage(image)"
                  loading="lazy"
                />
              </div>
            </section>

            <section class="flex flex-wrap gap-4 border-t border-border pt-6">
              <a
                *ngIf="project.liveUrl"
                [href]="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" x2="21" y1="14" y2="3"/>
                </svg>
                View Live Demo
              </a>
              <a
                *ngIf="project.repoUrl"
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
                View Repository
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>

    <app-lightbox
      [images]="lightboxImages()"
      [currentIndex]="lightboxIndex()"
      [isOpen]="lightboxOpen()"
      (closeEvent)="closeLightbox()"
      (previousEvent)="previousImage()"
      (nextEvent)="nextImage()"
    />
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
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectDetailDialogComponent implements OnInit {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closeDialog = new EventEmitter<void>();

  readonly isLoading = signal(true);
  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  readonly lightboxImages = computed<LightboxImage[]>(() => {
    if (!this.project) return [];

    const images: LightboxImage[] = [];

    images.push({ src: this.project.imgUrl, alt: this.project.title });

    this.project.details.features.forEach(feature => {
      if (feature.image) {
        images.push({ src: feature.image, alt: feature.title });
      }
    });

    this.project.details.challenges.forEach(challenge => {
      if (challenge.image) {
        images.push({ src: challenge.image, alt: challenge.title });
      }
    });

    this.project.details.learnings.forEach(learning => {
      learning.points.forEach(point => {
        if (point.image) {
          images.push({ src: point.image, alt: point.text });
        }
      });
    });

    this.project.details.additionalImages.forEach((image, index) => {
      images.push({ src: image, alt: `Gallery image ${index + 1}` });
    });

    return images;
  });

  ngOnInit(): void {
    if (this.isOpen) {
      this.preventBodyScroll();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (this.isOpen && event.key === 'Escape' && !this.lightboxOpen()) {
      this.close();
    }
  }

  close(): void {
    this.allowBodyScroll();
    this.closeDialog.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onImageLoad(): void {
    this.isLoading.set(false);
  }

  onImageError(): void {
    this.isLoading.set(false);
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  openLightboxForImage(imageSrc: string): void {
    const index = this.lightboxImages().findIndex(img => img.src === imageSrc);
    if (index !== -1) {
      this.openLightbox(index);
    }
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  previousImage(): void {
    const current = this.lightboxIndex();
    if (current > 0) {
      this.lightboxIndex.set(current - 1);
    }
  }

  nextImage(): void {
    const current = this.lightboxIndex();
    if (current < this.lightboxImages().length - 1) {
      this.lightboxIndex.set(current + 1);
    }
  }

  private preventBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  private allowBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
