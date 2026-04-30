import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningDetail } from '@data/projectData';

@Component({
  selector: 'app-project-learnings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="learnings" *ngIf="learnings?.length" id="learnings">
      <h2 class="section-title">
        <span class="section-eyebrow">Takeaways</span>
        Learnings
      </h2>
      <div class="learning-grid">
        <article *ngFor="let learning of learnings" class="learning-card">
          <h3 class="learning-title">{{ learning.title }}</h3>
          <ul class="learning-points">
            <li *ngFor="let point of learning.points">
              <svg class="check-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="point-text">
                {{ point.text }}
                <button
                  type="button"
                  *ngIf="point.image"
                  class="point-image-trigger"
                  (click)="imageClick.emit(point.image!)"
                  [attr.aria-label]="'Open image for ' + point.text"
                >
                  view image
                </button>
              </span>
            </li>
          </ul>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .learnings { padding: 2.5rem 0; border-bottom: 1px solid hsl(var(--border)); }
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
    .learning-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 768px) {
      .learning-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    }
    .learning-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .learning-title {
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: -0.005em;
      margin: 0;
      color: hsl(var(--foreground));
      padding-bottom: 0.5rem;
      border-bottom: 2px solid hsl(var(--primary) / 0.4);
      align-self: flex-start;
    }
    .learning-points {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .learning-points li {
      display: grid;
      grid-template-columns: 1.25rem 1fr;
      gap: 0.6rem;
      align-items: start;
      font-size: 0.925rem;
      line-height: 1.55;
      color: hsl(var(--muted-foreground));
    }
    .check-icon {
      width: 1.1rem;
      height: 1.1rem;
      color: hsl(var(--primary));
      margin-top: 0.15rem;
      flex-shrink: 0;
    }
    .point-image-trigger {
      display: inline-flex;
      align-items: center;
      margin-left: 0.5rem;
      padding: 0;
      background: none;
      border: none;
      font-size: 0.8rem;
      color: hsl(var(--primary));
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
    }
  `]
})
export class ProjectLearningsComponent {
  @Input() learnings: readonly LearningDetail[] = [];
  @Output() imageClick = new EventEmitter<string>();
}
