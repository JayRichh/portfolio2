import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery" *ngIf="images?.length" id="gallery">
      <h2 class="section-title">
        <span class="section-eyebrow">Visual</span>
        Gallery
      </h2>
      <div class="gallery-mosaic">
        <button
          type="button"
          *ngFor="let image of images; let i = index"
          class="gallery-tile"
          [class.tall]="(i + 1) % 4 === 0"
          [class.wide]="(i + 1) % 5 === 0"
          (click)="imageClick.emit(i)"
          [attr.aria-label]="'Open gallery image ' + (i + 1)"
        >
          <img [src]="image" [alt]="'Gallery image ' + (i + 1)" loading="lazy" />
        </button>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .gallery { padding: 2.5rem 0; }
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
    .gallery-mosaic {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 160px;
      gap: 0.75rem;
    }
    @media (min-width: 640px) {
      .gallery-mosaic { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 180px; }
    }
    @media (min-width: 1024px) {
      .gallery-mosaic { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; }
    }
    .gallery-tile {
      position: relative;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: 0.5rem;
      overflow: hidden;
      cursor: pointer;
      background: hsl(var(--muted));
      transition: transform 200ms ease;
    }
    .gallery-tile:hover { transform: translateY(-2px); }
    .gallery-tile.tall { grid-row: span 2; }
    .gallery-tile.wide { grid-column: span 2; }
    .gallery-tile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .gallery-tile:hover img { transform: scale(1.05); }
  `]
})
export class ProjectGalleryComponent {
  @Input() images: readonly string[] = [];
  @Output() imageClick = new EventEmitter<number>();
}
