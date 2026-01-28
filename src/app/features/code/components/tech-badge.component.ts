import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { techIcons } from '@data/techIcons';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="badgeClasses"
      [disabled]="!isClickable"
      (click)="handleClick($event)"
      [style.border-color]="techColor"
    >
      <span class="inline-flex items-center gap-1.5">
        <span
          *ngIf="techColor"
          class="w-2 h-2 rounded-full"
          [style.background-color]="techColor"
        ></span>
        {{ tech }}
      </span>
    </button>
  `,
  styles: [`
    button {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    button:not(:disabled):hover {
      transform: scale(1.02);
    }

    button:not(:disabled):active {
      transform: scale(0.98);
    }
  `]
})
export class TechBadgeComponent {
  @Input() tech!: string;
  @Input() isActive = false;
  @Input() isClickable = false;
  @Output() badgeClick = new EventEmitter<string>();

  get techColor(): string | undefined {
    const techInfo = techIcons[this.tech as keyof typeof techIcons];
    return techInfo?.color;
  }

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-all';

    if (!this.isClickable) {
      return `${baseClasses} bg-secondary/50 text-secondary-foreground border-transparent cursor-default`;
    }

    if (this.isActive) {
      return `${baseClasses} bg-primary/10 text-primary border-primary/20 shadow-sm`;
    }

    return `${baseClasses} bg-secondary/20 text-foreground border-border hover:bg-secondary/40 hover:border-primary/30 cursor-pointer`;
  }

  handleClick(event: Event): void {
    event.stopPropagation();
    if (this.isClickable) {
      this.badgeClick.emit(this.tech);
    }
  }
}
