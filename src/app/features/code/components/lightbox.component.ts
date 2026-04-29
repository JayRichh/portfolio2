import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
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

      <div
        class="absolute inset-0 flex items-center justify-center overflow-hidden touch-none select-none"
        (wheel)="onWheel($event)"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
        (dblclick)="onDoubleClick()"
        (click)="onSurfaceClick($event)"
      >
        <img
          [src]="currentImage.src"
          [alt]="currentImage.alt"
          [style.transform]="imageTransform()"
          [style.cursor]="imageCursor()"
          [style.transition]="isInteracting() ? 'none' : 'transform 150ms ease-out'"
          class="max-h-[90vh] max-w-[90vw] object-contain will-change-transform"
          draggable="false"
        />
      </div>

      <button
        type="button"
        class="absolute right-4 top-4 z-20 rounded-lg bg-white/10 p-2 text-white transition-all hover:bg-white/20 pointer-events-auto"
        (click)="close(); $event.stopPropagation()"
        aria-label="Close lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>

      <button
        *ngIf="scale() !== 1"
        type="button"
        class="absolute right-16 top-4 z-20 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 pointer-events-auto"
        (click)="resetZoom(); $event.stopPropagation()"
        aria-label="Reset zoom"
      >
        Reset
      </button>

      <button
        *ngIf="images.length > 1"
        type="button"
        class="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
        (click)="previous(); $event.stopPropagation()"
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
        (click)="next(); $event.stopPropagation()"
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

  readonly scale = signal(1);
  readonly translateX = signal(0);
  readonly translateY = signal(0);
  readonly isInteracting = signal(false);

  readonly imageTransform = computed(() =>
    `translate(${this.translateX()}px, ${this.translateY()}px) scale(${this.scale()})`
  );

  readonly imageCursor = computed(() => {
    if (this.scale() <= 1) return 'zoom-in';
    return this.isInteracting() ? 'grabbing' : 'grab';
  });

  private readonly pointers = new Map<number, { x: number; y: number }>();
  private initialPinchDistance = 0;
  private initialPinchScale = 1;
  private isPanning = false;
  private panStart = { x: 0, y: 0 };
  private translateStart = { x: 0, y: 0 };
  private readonly minScale = 1;
  private readonly maxScale = 8;

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
        this.resetZoom();
      }, 0);
    }
    if (changes['currentIndex'] && !changes['currentIndex'].firstChange) {
      this.resetZoom();
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
        if (this.scale() === 1) this.previous();
        break;
      case 'ArrowRight':
        if (this.scale() === 1) this.next();
        break;
      case '0':
        this.resetZoom();
        break;
    }
  }

  close(): void {
    this.allowBodyScroll();
    this.resetZoom();
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

  resetZoom(): void {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  onSurfaceClick(event: MouseEvent): void {
    if (this.scale() === 1) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') return;
      this.close();
    }
  }

  onDoubleClick(): void {
    if (this.scale() > 1) {
      this.resetZoom();
    } else {
      this.scale.set(2.5);
    }
  }

  onWheel(event: WheelEvent): void {
    if (!this.isOpen) return;
    event.preventDefault();

    const surface = event.currentTarget as HTMLElement;
    const rect = surface.getBoundingClientRect();
    const cx = event.clientX - rect.left - rect.width / 2;
    const cy = event.clientY - rect.top - rect.height / 2;

    const oldScale = this.scale();
    const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    const newScale = this.clampScale(oldScale * factor);

    if (newScale === oldScale) return;

    if (newScale === 1) {
      this.resetZoom();
      return;
    }

    const ratio = newScale / oldScale;
    const newTx = cx - (cx - this.translateX()) * ratio;
    const newTy = cy - (cy - this.translateY()) * ratio;

    this.scale.set(newScale);
    this.translateX.set(newTx);
    this.translateY.set(newTy);
  }

  onPointerDown(event: PointerEvent): void {
    const surface = event.currentTarget as HTMLElement;
    surface.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.isInteracting.set(true);

    if (this.pointers.size === 2) {
      this.isPanning = false;
      const points = Array.from(this.pointers.values());
      this.initialPinchDistance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      this.initialPinchScale = this.scale();
    } else if (this.pointers.size === 1 && this.scale() > 1) {
      this.isPanning = true;
      this.panStart = { x: event.clientX, y: event.clientY };
      this.translateStart = { x: this.translateX(), y: this.translateY() };
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.pointers.size === 2) {
      const points = Array.from(this.pointers.values());
      const newDistance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      if (this.initialPinchDistance === 0) return;

      const newScale = this.clampScale(this.initialPinchScale * (newDistance / this.initialPinchDistance));
      if (newScale === 1) {
        this.resetZoom();
      } else {
        this.scale.set(newScale);
      }
    } else if (this.pointers.size === 1 && this.isPanning) {
      const dx = event.clientX - this.panStart.x;
      const dy = event.clientY - this.panStart.y;
      this.translateX.set(this.translateStart.x + dx);
      this.translateY.set(this.translateStart.y + dy);
    }
  }

  onPointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) {
      this.initialPinchDistance = 0;
    }
    if (this.pointers.size === 0) {
      this.isPanning = false;
      this.isInteracting.set(false);
    }
  }

  private clampScale(value: number): number {
    return Math.max(this.minScale, Math.min(this.maxScale, value));
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
