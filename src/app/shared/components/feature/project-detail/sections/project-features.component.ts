import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureDetail } from '@data/projectData';

@Component({
  selector: 'app-project-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="features" *ngIf="features?.length" id="features">
      <h2 class="section-title">
        <span class="section-eyebrow">Build</span>
        Key Features
      </h2>
      <ol class="feature-list">
        <li *ngFor="let feature of features; let i = index" class="feature-row" [class.reverse]="i % 2 === 1">
          <div class="feature-text">
            <span class="feature-index">{{ formatIndex(i) }}</span>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-body">{{ feature.text }}</p>
          </div>
          <figure class="feature-media" *ngIf="feature.image" (click)="imageClick.emit(feature.image)">
            <img [src]="feature.image" [alt]="feature.title" loading="lazy" />
          </figure>
        </li>
      </ol>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .features { padding: 2.5rem 0; border-bottom: 1px solid hsl(var(--border)); }
    .section-title {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: clamp(1.5rem, 2.4vw, 1.875rem);
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 0 0 2rem;
      color: hsl(var(--foreground));
    }
    .section-eyebrow {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: hsl(var(--primary));
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .feature-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      align-items: center;
    }
    @media (min-width: 768px) {
      .feature-row {
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
      }
      .feature-row.reverse .feature-text { order: 2; }
      .feature-row.reverse .feature-media { order: 1; }
    }
    .feature-text { display: flex; flex-direction: column; gap: 0.5rem; }
    .feature-index {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: hsl(var(--primary));
    }
    .feature-title {
      font-size: clamp(1.25rem, 1.8vw, 1.5rem);
      font-weight: 600;
      line-height: 1.25;
      margin: 0;
      color: hsl(var(--foreground));
    }
    .feature-body {
      font-size: 1rem;
      line-height: 1.65;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }
    .feature-media {
      margin: 0;
      border-radius: 0.6rem;
      overflow: hidden;
      background: hsl(var(--muted));
      cursor: pointer;
      aspect-ratio: 16 / 10;
    }
    .feature-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .feature-media:hover img { transform: scale(1.04); }
  `]
})
export class ProjectFeaturesComponent {
  @Input() features: readonly FeatureDetail[] = [];
  @Output() imageClick = new EventEmitter<string>();

  formatIndex(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
