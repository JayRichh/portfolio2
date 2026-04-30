import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '@data/projectData';
import { ProjectDetailViewComponent } from '@shared/components/feature/project-detail-view/project-detail-view.component';
import { BrowserPlatformService } from '@core/services/browser-platform.service';

@Component({
  selector: 'app-project-detail-dialog',
  standalone: true,
  imports: [CommonModule, ProjectDetailViewComponent],
  template: `
    <div
      *ngIf="isOpen && project"
      @fadeIn
      class="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm"
      (click)="onBackdropClick($event)"
    >
      <div class="min-h-screen flex items-start justify-center p-4 sm:p-8" (click)="onBackdropClick($event)">
        <div
          @slideUp
          class="relative w-full max-w-7xl my-8 rounded-lg bg-card text-card-foreground shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <button
            type="button"
            class="absolute right-4 top-4 z-10 rounded-lg bg-background/80 p-2 text-foreground transition-all hover:bg-background"
            (click)="close()"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
          <app-project-detail-view [project]="project" />
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 }))])
    ]),
    trigger('slideUp', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(20px)' }), animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))])
    ])
  ]
})
export class ProjectDetailDialogComponent {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closeDialog = new EventEmitter<void>();

  private readonly platform = inject(BrowserPlatformService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  close(): void {
    if (this.platform.isBrowser) this.platform.document.body.style.overflow = '';
    this.closeDialog.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}
