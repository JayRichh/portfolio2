import { Component, Input, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserPlatformService } from '@core/services/browser-platform.service';

export interface TocItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-project-toc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="toc" *ngIf="items?.length" aria-label="Project sections">
      <span class="toc-label">On this page</span>
      <ol class="toc-list">
        <li *ngFor="let item of items">
          <a
            [href]="'#' + item.id"
            class="toc-link"
            [class.active]="active() === item.id"
            (click)="onClick($event, item.id)"
          >
            <span class="toc-marker"></span>
            <span class="toc-text">{{ item.label }}</span>
          </a>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .toc {
      position: sticky;
      top: 6rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .toc-label {
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 600;
      color: hsl(var(--muted-foreground));
    }
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      border-left: 1px solid hsl(var(--border));
    }
    .toc-link {
      display: grid;
      grid-template-columns: 0.75rem 1fr;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      margin-left: -1px;
      font-size: 0.85rem;
      color: hsl(var(--muted-foreground));
      text-decoration: none;
      border-left: 2px solid transparent;
      transition: color 150ms ease, border-color 150ms ease;
    }
    .toc-link:hover { color: hsl(var(--foreground)); }
    .toc-link.active {
      color: hsl(var(--primary));
      border-left-color: hsl(var(--primary));
      font-weight: 500;
    }
    .toc-marker {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.4;
    }
    .toc-link.active .toc-marker { opacity: 1; }
  `]
})
export class ProjectTocComponent implements OnInit, OnDestroy {
  @Input() items: readonly TocItem[] = [];

  private readonly platform = inject(BrowserPlatformService);
  private observer?: IntersectionObserver;

  readonly active = signal<string>('');

  ngOnInit(): void {
    if (!this.platform.isBrowser || typeof IntersectionObserver === 'undefined') return;
    queueMicrotask(() => this.observe());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  onClick(event: Event, id: string): void {
    if (!this.platform.isBrowser) return;
    const target = this.platform.document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.active.set(id);
  }

  private observe(): void {
    const doc = this.platform.document;
    const targets = this.items
      .map(i => doc.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target instanceof HTMLElement) {
          this.active.set(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );
    targets.forEach(t => this.observer!.observe(t));
  }
}
