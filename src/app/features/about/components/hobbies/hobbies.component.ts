import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HOBBY_GROUPS } from './hobbies.data';

interface CardOffset {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface FloatingCardState {
  x: number;
  y: number;
  isHovered: boolean;
  mouseX: number;
  mouseY: number;
  circleX: number;
  circleY: number;
  isFlipped: boolean;
}

const lerp = (start: number, end: number, t: number): number => {
  t = Math.max(0, Math.min(1, t));
  return start * (1 - t) + end * t;
};

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.scss'
})
export class HobbiesComponent implements OnInit, OnDestroy {
  @ViewChildren('groupWrapper') groupWrappers!: QueryList<ElementRef>;

  private scrollListener?: () => void;
  private animationFrames: number[] = [];
  private isMobile = false;
  private cardOffsets: CardOffset[][] = [];

  readonly cardStates = signal<FloatingCardState[][]>([]);

  readonly hobbyGroups = HOBBY_GROUPS;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      this.initializeCardOffsetsOnce();
      this.initializeCardStates();
      this.scrollListener = this.updateCardPositions.bind(this);
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      setTimeout(() => this.updateCardPositions(), 100);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
  }

  private initializeCardOffsetsOnce(): void {
    this.cardOffsets = this.hobbyGroups.map(group => {
      const total = group.details.length;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const cardWidth = this.isMobile ? 240 : 320;
      const cardHeight = this.isMobile ? 300 : 400;

      const maxX = Math.max(0, (viewportWidth - cardWidth) / 2 - 8);
      const maxY = Math.max(0, (viewportHeight - cardHeight) / 2 - 8);

      const radiusX = this.isMobile
        ? Math.min(maxX, viewportWidth * 0.18)
        : Math.min(maxX, viewportWidth * 0.32);
      const radiusY = this.isMobile
        ? Math.min(maxY, viewportHeight * 0.16)
        : Math.min(maxY, viewportHeight * 0.20);

      const noiseScale = this.isMobile ? 0.03 : 0.06;

      return group.details.map((_, index) => {
        const angle = (index / Math.max(1, total)) * Math.PI * 2 + Math.PI / 4;
        let baseX = Math.cos(angle) * radiusX;
        let baseY = Math.sin(angle) * radiusY;

        baseX += (Math.random() - 0.5) * (viewportWidth * noiseScale);
        baseY += (Math.random() - 0.5) * (viewportHeight * noiseScale);

        baseX = Math.max(-maxX, Math.min(maxX, baseX));
        baseY = Math.max(-maxY, Math.min(maxY, baseY));

        return {
          x: baseX,
          y: baseY,
          rotation: (Math.random() - 0.5) * (this.isMobile ? 5 : 10),
          scale: this.isMobile ? 0.92 + Math.random() * 0.08 : 0.95 + Math.random() * 0.1
        };
      });
    });
  }

  private initializeCardStates(): void {
    const states = this.hobbyGroups.map(group =>
      group.details.map(() => ({
        x: 0,
        y: 0,
        isHovered: false,
        mouseX: 0,
        mouseY: 0,
        circleX: 0,
        circleY: 0,
        isFlipped: false
      }))
    );
    this.cardStates.set(states);
  }

  private updateCardPositions(): void {
    if (!this.groupWrappers || this.groupWrappers.length === 0) return;

    const newStates = this.cardStates().map((groupCards, groupIndex) => {
      const wrapper = this.groupWrappers.toArray()[groupIndex];
      if (!wrapper) return groupCards;

      const rect = wrapper.nativeElement.getBoundingClientRect();
      const progress = this.getScrollProgress(rect);

      return groupCards.map((card, cardIndex) => {
        const offset = this.cardOffsets[groupIndex][cardIndex];

        const expansionStart = 0;
        const expansionEnd = this.isMobile ? 0.9 : 0.7;
        const scrollFactor = Math.max(0, Math.min(1, (progress - expansionStart) / (expansionEnd - expansionStart)));

        return {
          ...card,
          x: offset.x * scrollFactor,
          y: offset.y * scrollFactor
        };
      });
    });

    this.cardStates.set(newStates);
  }

  private getScrollProgress(rect: DOMRect): number {
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    return (windowHeight - elementTop) / (windowHeight + elementHeight);
  }

  getCardTransform(groupIndex: number, cardIndex: number): string {
    const state = this.cardStates()[groupIndex]?.[cardIndex];
    const offset = this.cardOffsets[groupIndex]?.[cardIndex];
    if (!state || !offset) return '';

    return `translate(${state.x}px, ${state.y}px) rotate(${offset.rotation}deg) scale(${offset.scale})`;
  }

  onCardHover(groupIndex: number, cardIndex: number, isHovered: boolean): void {
    const newStates = [...this.cardStates()];
    newStates[groupIndex][cardIndex] = {
      ...newStates[groupIndex][cardIndex],
      isHovered,
      isFlipped: isHovered
    };
    this.cardStates.set(newStates);

    if (!isHovered) {
      this.animationFrames.forEach(id => cancelAnimationFrame(id));
      this.animationFrames = [];
    }
  }

  onCardMouseMove(groupIndex: number, cardIndex: number, event: MouseEvent): void {
    const state = this.cardStates()[groupIndex][cardIndex];
    if (!state.isHovered) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newStates = [...this.cardStates()];
    newStates[groupIndex][cardIndex] = {
      ...newStates[groupIndex][cardIndex],
      mouseX,
      mouseY
    };
    this.cardStates.set(newStates);

    this.animateCircle(groupIndex, cardIndex, rect);
  }

  private animateCircle(groupIndex: number, cardIndex: number, rect: DOMRect): void {
    const animate = () => {
      const state = this.cardStates()[groupIndex][cardIndex];
      if (!state.isHovered) return;

      const cardWidth = this.isMobile ? 240 : 320;
      const cardHeight = this.isMobile ? 300 : 400;
      const circleSize = this.isMobile ? 16 : 24;

      const scaleX = cardWidth / rect.width;
      const scaleY = cardHeight / rect.height;

      const scaledX = state.mouseX * scaleX;
      const scaledY = state.mouseY * scaleY;

      const targetX = scaledX - circleSize / 2;
      const targetY = scaledY - circleSize / 2;

      const newX = lerp(state.circleX, targetX, 0.2);
      const newY = lerp(state.circleY, targetY, 0.2);

      const newStates = [...this.cardStates()];
      newStates[groupIndex][cardIndex] = {
        ...newStates[groupIndex][cardIndex],
        circleX: newX,
        circleY: newY
      };
      this.cardStates.set(newStates);

      const frameId = requestAnimationFrame(animate);
      this.animationFrames.push(frameId);
    };

    animate();
  }

  getImagePosition(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('satisfactory') || lowerTitle.includes('borderlands')) {
      return 'center 30%';
    }
    if (lowerTitle.includes('risk of rain')) {
      return 'center 60%';
    }
    return 'center 40%';
  }
}
