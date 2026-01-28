import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TooltipItem {
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'app-image-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible()"
      class="tooltip-container"
      [style.left.px]="position().x"
      [style.top.px]="position().y"
      [class.tooltip-visible]="isContentVisible()"
    >
      <div
        class="tooltip-content"
        #scrollContainer
        (wheel)="onMouseWheel($event)"
      >
        <div class="scroll-viewport" [style.transform]="'translateY(' + scrollOffset() + 'px)'">
          <div *ngFor="let item of items()" class="tooltip-item">
            <img
              [src]="item.imageUrl"
              [alt]="item.title"
              class="tooltip-image"
              loading="eager"
            />
            <div class="tooltip-overlay">
              <h4 class="tooltip-title">{{ item.title }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transform: translateY(0);
      transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }

    .tooltip-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .tooltip-content {
      position: relative;
      width: 480px;
      height: 360px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4),
                  0 0 0 1px hsl(var(--border) / 0.5);
      background: hsl(var(--card));
    }

    .scroll-viewport {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      transition: transform 0.15s ease-out;
    }

    .tooltip-item {
      position: relative;
      width: 100%;
      height: 360px;
      flex-shrink: 0;
    }

    .tooltip-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tooltip-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem 1.25rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4) 50%, transparent);
    }

    .tooltip-title {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      line-height: 1.3;
    }

    @media (max-width: 768px) {
      .tooltip-container {
        display: none;
      }
    }
  `]
})
export class ImageTooltipComponent {
  readonly isVisible = signal(false);
  readonly isContentVisible = signal(false);
  readonly items = signal<TooltipItem[]>([]);
  readonly position = signal({ x: 0, y: 0 });
  readonly scrollOffset = signal(0);

  private targetPosition = { x: 0, y: 0 };
  private currentPosition = { x: 0, y: 0 };
  private animationFrame: number | null = null;
  private hasInitialPosition = false;
  private currentIndex = 0;
  private readonly ITEM_HEIGHT = 360;
  private readonly SCROLL_SPEED = 50;

  show(items: TooltipItem[], selectedIndex: number = 0): void {
    this.items.set(items);
    this.scrollToIndex(selectedIndex);
    this.hasInitialPosition = false;

    if (!this.isVisible()) {
      this.isVisible.set(true);
      this.isContentVisible.set(true);
    }
  }

  hide(): void {
    this.isVisible.set(false);
    this.isContentVisible.set(false);

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  scrollToIndex(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.items().length - 1));
    this.scrollOffset.set(-this.currentIndex * this.ITEM_HEIGHT);
  }

  onMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    const direction = event.deltaY > 0 ? 1 : -1;
    const newIndex = this.currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.items().length) {
      this.scrollToIndex(newIndex);
    }
  }

  updatePosition(x: number, y: number): void {
    const offsetX = 20;
    const offsetY = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 480;
    const tooltipHeight = 360;

    let posX = x + offsetX;
    let posY = y + offsetY;

    if (posX + tooltipWidth > viewportWidth - 20) {
      posX = x - tooltipWidth - offsetX;
    }

    if (posY + tooltipHeight > viewportHeight - 20) {
      posY = y - tooltipHeight - offsetY;
    }

    posX = Math.max(20, posX);
    posY = Math.max(20, posY);

    this.targetPosition = { x: posX, y: posY };

    if (!this.hasInitialPosition) {
      this.currentPosition = { x: posX, y: posY };
      this.position.set({ x: posX, y: posY });
      this.hasInitialPosition = true;
      this.startLerp();
    }
  }

  private startLerp(): void {
    const lerp = (start: number, end: number, factor: number): number => {
      return start + (end - start) * factor;
    };

    const animate = (): void => {
      const lerpFactor = 0.2;
      const threshold = 0.1;

      this.currentPosition.x = lerp(this.currentPosition.x, this.targetPosition.x, lerpFactor);
      this.currentPosition.y = lerp(this.currentPosition.y, this.targetPosition.y, lerpFactor);

      const distanceX = Math.abs(this.targetPosition.x - this.currentPosition.x);
      const distanceY = Math.abs(this.targetPosition.y - this.currentPosition.y);

      if (distanceX < threshold && distanceY < threshold) {
        this.currentPosition.x = this.targetPosition.x;
        this.currentPosition.y = this.targetPosition.y;
      }

      this.position.set({
        x: Math.round(this.currentPosition.x * 10) / 10,
        y: Math.round(this.currentPosition.y * 10) / 10
      });

      if (this.isVisible()) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
