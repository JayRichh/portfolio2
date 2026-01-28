import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent {
  readonly content = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly isVisible = signal(false);

  showTooltip(): void {
    this.isVisible.set(true);
  }

  hideTooltip(): void {
    this.isVisible.set(false);
  }
}
