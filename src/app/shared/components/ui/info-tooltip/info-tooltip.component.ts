import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-info-tooltip',
    imports: [],
    templateUrl: './info-tooltip.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
