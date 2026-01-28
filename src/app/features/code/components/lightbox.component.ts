import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

export interface LightboxImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      @fadeIn
      class="fixed inset-0 z-[200]"
    >
      <div
        class="absolute inset-0 bg-black/90"
        (click)="close()"
      ></div>

      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          [src]="currentImage.src"
          [alt]="currentImage.alt"
          class="max-h-[90vh] max-w-[90vw] object-contain pointer-events-none"
        />
      </div>

      <button
        type="button"
        class="absolute right-4 top-4 z-20 rounded-lg bg-white/10 p-2 text-white transition-all hover:bg-white/20 pointer-events-auto"
        (click)="close()"
        aria-label="Close lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>

      <button
        *ngIf="images.length > 1"
        type="button"
        class="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
        (click)="previous()"
        [disabled]="currentIndex === 0"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      <button
        *ngIf="images.length > 1"
        type="button"
        class="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
        (click)="next()"
        [disabled]="currentIndex === images.length - 1"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      <div
        *ngIf="images.length > 1"
        class="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white pointer-events-none"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
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
export class LightboxComponent implements OnInit, OnDestroy, OnChanges {
  @Input() images: LightboxImage[] = [];
  @Input() currentIndex = 0;
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() nextEvent = new EventEmitter<void>();

  get currentImage(): LightboxImage {
    return this.images[this.currentIndex] || { src: '', alt: '' };
  }

  ngOnInit(): void {
    if (this.isOpen) {
      this.preventBodyScroll();
    }
  }

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

  ngOnDestroy(): void {
    this.allowBodyScroll();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.previous();
        break;
      case 'ArrowRight':
        this.next();
        break;
    }
  }

  close(): void {
    this.allowBodyScroll();
    this.closeEvent.emit();
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.previousEvent.emit();
    }
  }

  next(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.nextEvent.emit();
    }
  }


  private preventBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    }
  }

  private allowBodyScroll(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }
}
