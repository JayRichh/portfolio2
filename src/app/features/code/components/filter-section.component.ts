import { Component, Input, Output, EventEmitter, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { TechBadgeComponent } from './tech-badge.component';
import { techCategories } from '@data/techCategories';

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent],
  template: `
    <div *ngIf="mounted()" class="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-6 pt-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative" #dropdownContainer>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-card/80"
            (click)="toggleDropdown()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>Filter by Technology</span>
            <span
              *ngIf="selectedTech.length > 0"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
            >
              {{ selectedTech.length }}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              [class.rotate-180]="isDropdownOpen"
              class="transition-transform"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <div
            *ngIf="isDropdownOpen"
            @slideDown
            class="absolute left-0 mt-2 w-full min-w-[500px] max-w-4xl rounded-lg border border-border bg-card p-4 shadow-lg sm:w-auto z-10"
          >
            <div class="space-y-4">
              <div *ngFor="let category of categoryKeys" class="space-y-2">
                <h3 class="text-sm font-semibold text-muted-foreground">
                  {{ category }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <app-tech-badge
                    *ngFor="let tech of techCategories[category]"
                    [tech]="tech"
                    [isActive]="isSelected(tech)"
                    [isClickable]="true"
                    (badgeClick)="onToggleTech($event)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          [class]="sortButtonClasses"
          (click)="onToggleSort()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 16 4 4 4-4"/>
            <path d="M7 20V4"/>
            <path d="m21 8-4-4-4 4"/>
            <path d="M17 4v16"/>
          </svg>
          <span>{{ sortByRecent ? 'Clear Sort' : 'Sort Recent' }}</span>
        </button>
      </div>

      <div *ngIf="selectedTech.length > 0" class="mt-4 flex flex-wrap gap-2" @fadeIn>
        <span class="text-sm text-muted-foreground">Active filters:</span>
        <app-tech-badge
          *ngFor="let tech of selectedTech"
          [tech]="tech"
          [isActive]="true"
          [isClickable]="true"
          (badgeClick)="onToggleTech($event)"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .rotate-180 {
      transform: rotate(180deg);
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class FilterSectionComponent {
  @Input() selectedTech: string[] = [];
  @Input() isDropdownOpen = false;
  @Input() sortByRecent = false;
  @Output() toggleTech = new EventEmitter<string>();
  @Output() dropdownOpenChange = new EventEmitter<boolean>();
  @Output() sortChange = new EventEmitter<boolean>();

  readonly mounted = signal(false);
  readonly techCategories = techCategories;
  readonly categoryKeys = Object.keys(techCategories);

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        setTimeout(() => this.mounted.set(true), 0);
      }
    }, { allowSignalWrites: true });
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('[class*="dropdown"]');

    if (this.isDropdownOpen && !target.closest('app-filter-section')) {
      this.dropdownOpenChange.emit(false);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpenChange.emit(!this.isDropdownOpen);
  }

  isSelected(tech: string): boolean {
    return this.selectedTech.includes(tech);
  }

  onToggleTech(tech: string): void {
    this.toggleTech.emit(tech);
  }

  onToggleSort(): void {
    this.sortChange.emit(!this.sortByRecent);
  }

  get sortButtonClasses(): string {
    const baseClasses = 'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all';

    if (this.sortByRecent) {
      return `${baseClasses} border-primary bg-primary/10 text-primary`;
    }

    return `${baseClasses} border-border bg-card text-foreground hover:border-primary/50`;
  }
}
