import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden rounded-lg border border-border bg-card">
      <div class="aspect-video w-full animate-pulse bg-muted"></div>

      <div class="p-4 xs:p-6 space-y-4">
        <div class="h-6 w-3/4 animate-pulse rounded bg-muted"></div>

        <div class="space-y-2">
          <div class="h-4 w-full animate-pulse rounded bg-muted"></div>
          <div class="h-4 w-5/6 animate-pulse rounded bg-muted"></div>
        </div>

        <div class="flex flex-wrap gap-2">
          <div class="h-7 w-20 animate-pulse rounded-lg bg-muted"></div>
          <div class="h-7 w-24 animate-pulse rounded-lg bg-muted"></div>
          <div class="h-7 w-16 animate-pulse rounded-lg bg-muted"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class ProjectCardSkeletonComponent {}
