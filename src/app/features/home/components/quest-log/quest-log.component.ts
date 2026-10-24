import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { projectData } from '@data/projectData';
import { sortProjectsByDate } from '@data/techUtils';

// The strip reads like an RPG quest log: one active quest (WHEKO) and the last three shipped projects.
@Component({
  selector: 'app-quest-log',
  imports: [RouterModule],
  template: `
    <section class="quest-log" aria-labelledby="quest-log-title">
      <div class="quest-header">
        <h2 id="quest-log-title" class="quest-title">Quest log</h2>
        <span class="quest-count">1 active, {{ recent.length }} recently completed</span>
      </div>

      <ol class="quest-list">
        <li class="quest active">
          <span class="quest-status">Active quest</span>
          <a href="https://wheko.nz" target="_blank" rel="noopener noreferrer" class="quest-link">
            <span class="quest-name">WHEKO</span>
            <span class="quest-text">A co-op life-skills RPG set in Aotearoa, built in Unreal Engine 5. Follow the build at wheko.nz.</span>
          </a>
        </li>
        @for (project of recent; track project.slug) {
          <li class="quest">
            <span class="quest-status">Completed {{ shipped(project.updatedAt) }}</span>
            <a [routerLink]="['/code', project.slug]" class="quest-link">
              <img [src]="project.imgUrl" alt="" width="160" height="90" loading="lazy" decoding="async" class="quest-art" />
              <span class="quest-name">{{ project.title }}</span>
              <span class="quest-text">{{ project.description }}</span>
            </a>
          </li>
        }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .quest-log {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 5rem;
    }
    .quest-header {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .quest-title {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .quest-count {
      color: hsl(var(--muted-foreground));
      font-size: 0.95rem;
    }
    .quest-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .quest {
      border: 1px solid hsl(var(--border));
      border-radius: 0.75rem;
      background: hsl(var(--card));
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .quest.active {
      border-color: hsl(var(--primary) / 0.6);
      box-shadow: inset 4px 0 0 hsl(var(--primary));
    }
    .quest-status {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: hsl(var(--muted-foreground));
    }
    .quest.active .quest-status { color: hsl(var(--primary)); }
    .quest-link {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      flex: 1;
    }
    .quest-art {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      object-position: top;
      border-radius: 0.5rem;
      border: 1px solid hsl(var(--border));
    }
    .quest-name {
      font-size: 1.25rem;
      font-weight: 600;
    }
    .quest-link:hover .quest-name { color: hsl(var(--primary)); }
    .quest-text {
      color: hsl(var(--muted-foreground));
      font-size: 0.95rem;
      line-height: 1.5;
    }
    @media (max-width: 767px) {
      .quest-log { padding: 0 1rem 4rem; }
    }
  `]
})
export class QuestLogComponent {
  readonly recent = sortProjectsByDate(projectData).slice(0, 3);

  shipped(iso: string): string {
    return new Date(iso).toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });
  }
}
