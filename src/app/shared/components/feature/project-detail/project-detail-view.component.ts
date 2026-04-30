import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '@data/projectData';
import { LightboxComponent, LightboxImage } from '@features/code/components/lightbox.component';
import { ProjectHeroComponent } from './sections/project-hero.component';
import { ProjectOverviewComponent } from './sections/project-overview.component';
import { ProjectFeaturesComponent } from './sections/project-features.component';
import { ProjectChallengesComponent } from './sections/project-challenges.component';
import { ProjectLearningsComponent } from './sections/project-learnings.component';
import { ProjectGalleryComponent } from './sections/project-gallery.component';
import { ProjectActionsComponent } from './sections/project-actions.component';
import { ProjectTocComponent, TocItem } from './sections/project-toc.component';

export type ProjectDetailMode = 'page' | 'modal';

@Component({
  selector: 'app-project-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    LightboxComponent,
    ProjectHeroComponent,
    ProjectOverviewComponent,
    ProjectFeaturesComponent,
    ProjectChallengesComponent,
    ProjectLearningsComponent,
    ProjectGalleryComponent,
    ProjectActionsComponent,
    ProjectTocComponent
  ],
  templateUrl: './project-detail-view.component.html',
  styleUrls: ['./project-detail-view.component.scss']
})
export class ProjectDetailViewComponent {
  @Input() project: Project | null = null;
  @Input() mode: ProjectDetailMode = 'modal';

  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);

  readonly lightboxImages = computed<LightboxImage[]>(() => {
    if (!this.project) return [];
    const images: LightboxImage[] = [{ src: this.project.imgUrl, alt: this.project.title }];
    this.project.details.features.forEach(f => f.image && images.push({ src: f.image, alt: f.title }));
    this.project.details.challenges.forEach(c => c.image && images.push({ src: c.image, alt: c.title }));
    this.project.details.learnings.forEach(l => l.points.forEach(p => p.image && images.push({ src: p.image, alt: p.text })));
    this.project.details.additionalImages.forEach((img, i) => images.push({ src: img, alt: `Gallery image ${i + 1}` }));
    return images;
  });

  readonly tocItems = computed<TocItem[]>(() => {
    if (!this.project) return [];
    const items: TocItem[] = [{ id: 'overview', label: 'Overview' }];
    if (this.project.details.features.length) items.push({ id: 'features', label: 'Features' });
    if (this.project.details.challenges.length) items.push({ id: 'challenges', label: 'Challenges' });
    if (this.project.details.learnings.length) items.push({ id: 'learnings', label: 'Learnings' });
    if (this.project.details.additionalImages.length) items.push({ id: 'gallery', label: 'Gallery' });
    return items;
  });

  openLightboxFor(src: string): void {
    const index = this.lightboxImages().findIndex(img => img.src === src);
    if (index !== -1) this.openLightboxAt(index);
  }

  openLightboxAt(index: number): void {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  openHeroLightbox(): void {
    this.openLightboxAt(0);
  }

  openGalleryAt(galleryIndex: number): void {
    if (!this.project) return;
    const offset =
      1 +
      this.project.details.features.filter(f => !!f.image).length +
      this.project.details.challenges.filter(c => !!c.image).length +
      this.project.details.learnings.reduce((acc, l) => acc + l.points.filter(p => !!p.image).length, 0);
    this.openLightboxAt(offset + galleryIndex);
  }

  closeLightbox(): void { this.lightboxOpen.set(false); }

  previousImage(): void {
    const c = this.lightboxIndex();
    if (c > 0) this.lightboxIndex.set(c - 1);
  }

  nextImage(): void {
    const c = this.lightboxIndex();
    if (c < this.lightboxImages().length - 1) this.lightboxIndex.set(c + 1);
  }
}
