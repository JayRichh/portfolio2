import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeDetail } from '@data/projectData';

@Component({
  selector: 'app-project-challenges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="challenges" *ngIf="challenges?.length" id="challenges">
      <h2 class="section-title">
        <span class="section-eyebrow">Friction</span>
        Challenges
      </h2>
      <ol class="challenge-list">
        <li *ngFor="let challenge of challenges; let i = index" class="challenge-item">
          <div class="challenge-marker">
            <span class="challenge-num">{{ i + 1 }}</span>
          </div>
          <div class="challenge-body">
            <h3 class="challenge-title">{{ challenge.title }}</h3>
            <p class="challenge-text">{{ challenge.text }}</p>
            <figure class="challenge-image" *ngIf="challenge.image" (click)="imageClick.emit(challenge.image)">
              <img [src]="challenge.image" [alt]="challenge.title" loading="lazy" />
            </figure>
          </div>
        </li>
      </ol>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .challenges { padding: 2.5rem 0; border-bottom: 1px solid hsl(var(--border)); }
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
    .challenge-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: c;
    }
    .challenge-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1.25rem;
      padding: 1.5rem 0;
      border-top: 1px solid hsl(var(--border) / 0.5);
    }
    .challenge-item:first-child { border-top: none; padding-top: 0; }
    .challenge-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .challenge-num {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.85rem;
      font-weight: 600;
      color: hsl(var(--primary));
      background: hsl(var(--primary) / 0.1);
      border: 1px solid hsl(var(--primary) / 0.3);
    }
    .challenge-body { display: flex; flex-direction: column; gap: 0.5rem; }
    .challenge-title {
      font-size: 1.2rem;
      font-weight: 600;
      line-height: 1.3;
      margin: 0;
      color: hsl(var(--foreground));
    }
    .challenge-text {
      font-size: 0.975rem;
      line-height: 1.65;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }
    .challenge-image {
      margin: 0.5rem 0 0;
      border-radius: 0.5rem;
      overflow: hidden;
      cursor: pointer;
      max-width: 540px;
    }
    .challenge-image img { width: 100%; height: auto; display: block; }
  `]
})
export class ProjectChallengesComponent {
  @Input() challenges: readonly ChallengeDetail[] = [];
  @Output() imageClick = new EventEmitter<string>();
}
