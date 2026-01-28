import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TooltipData {
  x: number;
  y: number;
  content: {
    title: string;
    items: { label: string; value: string }[];
  } | null;
}

@Component({
  selector: 'app-chart-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-tooltip.component.html',
  styleUrls: ['./chart-tooltip.component.scss']
})
export class ChartTooltipComponent {
  readonly data = signal<TooltipData>({
    x: 0,
    y: 0,
    content: null
  });

  readonly isVisible = computed(() => this.data().content !== null);

  readonly position = computed(() => {
    const d = this.data();
    const offset = 12;

    return {
      left: `${d.x + offset}px`,
      top: `${d.y + offset}px`
    };
  });

  show(x: number, y: number, content: TooltipData['content']): void {
    this.data.set({ x, y, content });
  }

  hide(): void {
    this.data.set({ x: 0, y: 0, content: null });
  }

  updatePosition(x: number, y: number): void {
    const current = this.data();
    if (current.content) {
      this.data.set({ ...current, x, y });
    }
  }
}
