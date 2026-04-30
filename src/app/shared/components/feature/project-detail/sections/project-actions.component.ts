import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="actions" [class.sticky]="sticky">
      <a
        *ngIf="liveUrl"
        [href]="liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="action primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" x2="21" y1="14" y2="3"/>
        </svg>
        <span>Live Demo</span>
      </a>
      <a
        *ngIf="repoUrl"
        [href]="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="action secondary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          <path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
        <span>Repository</span>
      </a>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .actions.sticky {
      position: sticky;
      bottom: 1rem;
      z-index: 20;
      margin-top: 2rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: hsl(var(--card) / 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid hsl(var(--border));
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.25);
    }
    .action {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.95rem;
      font-weight: 500;
      text-decoration: none;
      transition: transform 150ms ease, background 150ms ease;
    }
    .action:hover { transform: translateY(-1px); }
    .action:active { transform: translateY(0); }
    .action.primary {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }
    .action.primary:hover { background: hsl(var(--primary) / 0.9); }
    .action.secondary {
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }
    .action.secondary:hover { background: hsl(var(--secondary) / 0.85); }
  `]
})
export class ProjectActionsComponent {
  @Input() liveUrl = '';
  @Input() repoUrl = '';
  @Input() sticky = false;
}
