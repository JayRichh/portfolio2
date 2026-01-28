import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slider-container">
      <button
        (click)="decrease()"
        [disabled]="value <= min"
        class="slider-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" x2="19" y1="12" y2="12"/></svg>
      </button>

      <div
        #track
        class="slider-track"
        (click)="handleTrackClick($event)"
      >
        <div class="slider-bg">
          <div class="slider-fill" [style.width.%]="percentage"></div>
        </div>
        <div
          #thumb
          class="slider-thumb"
          [style.left.%]="percentage"
          (pointerdown)="startDrag($event)"
          (pointermove)="drag($event)"
          (pointerup)="endDrag($event)"
        ></div>
      </div>

      <button
        (click)="increase()"
        [disabled]="value >= max"
        class="slider-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
      </button>

      <span class="slider-value">{{ value }}</span>
    </div>
  `,
  styles: [`
    .slider-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .slider-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
      border-radius: 9999px;
      background: hsl(var(--muted));
      border: none;
      cursor: pointer;
      transition: background 0.15s;

      &:hover:not(:disabled) {
        background: hsl(var(--muted) / 0.8);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      svg {
        color: hsl(var(--foreground));
      }
    }

    .slider-track {
      position: relative;
      flex: 1;
      height: 2rem;
      cursor: pointer;
    }

    .slider-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 0.5rem;
      transform: translateY(-50%);
      border-radius: 9999px;
      background: hsl(var(--muted));
    }

    .slider-fill {
      height: 100%;
      border-radius: 9999px;
      background: hsl(var(--primary));
    }

    .slider-thumb {
      position: absolute;
      top: 50%;
      width: 1.5rem;
      height: 1.5rem;
      transform: translate(-50%, -50%);
      border-radius: 9999px;
      background: hsl(var(--background));
      border: 2px solid hsl(var(--primary));
      cursor: grab;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.15s;

      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }

      &:active {
        cursor: grabbing;
      }
    }

    .slider-value {
      min-width: 1.5rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `]
})
export class SliderComponent implements AfterViewInit {
  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  @ViewChild('track') trackRef?: ElementRef<HTMLDivElement>;
  @ViewChild('thumb') thumbRef?: ElementRef<HTMLDivElement>;

  private isDragging = false;

  get percentage(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.trackRef) {
      this.trackRef.nativeElement.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }
  }

  decrease(): void {
    if (this.value > this.min) {
      this.valueChange.emit(Math.max(this.value - 1, this.min));
    }
  }

  increase(): void {
    if (this.value < this.max) {
      this.valueChange.emit(Math.min(this.value + 1, this.max));
    }
  }

  handleTrackClick(event: MouseEvent): void {
    if (!this.trackRef || event.target === this.thumbRef?.nativeElement) return;

    const rect = this.trackRef.nativeElement.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const newValue = Math.round(this.min + percentage * (this.max - this.min));
    this.valueChange.emit(Math.min(Math.max(newValue, this.min), this.max));
  }

  startDrag(event: PointerEvent): void {
    this.isDragging = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  drag(event: PointerEvent): void {
    if (!this.isDragging || !this.trackRef) return;

    const rect = this.trackRef.nativeElement.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const newValue = Math.round(this.min + percentage * (this.max - this.min));
    this.valueChange.emit(Math.min(Math.max(newValue, this.min), this.max));
  }

  endDrag(event: PointerEvent): void {
    this.isDragging = false;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  }

  private handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = Math.sign(-event.deltaY);
    const newValue = this.value + delta;
    this.valueChange.emit(Math.min(Math.max(newValue, this.min), this.max));
  }
}
