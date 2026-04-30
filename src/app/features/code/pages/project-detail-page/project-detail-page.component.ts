import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { projectData, Project } from '@data/projectData';
import { ProjectDetailViewComponent } from '@shared/components/feature/project-detail/project-detail-view.component';
import { MetaService } from '@core/services/meta.service';
import { JsonLdService } from '@core/services/json-ld.service';

@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectDetailViewComponent],
  template: `
    <div class="min-h-screen bg-background pt-24 md:pt-32">
      <div class="container mx-auto px-4 pb-24 sm:px-6 lg:px-8">
        <nav class="mb-8 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
          <span aria-hidden="true">/</span>
          <a routerLink="/code" class="hover:text-foreground transition-colors">Projects</a>
          <span aria-hidden="true">/</span>
          <span class="text-foreground" aria-current="page">{{ project()?.title }}</span>
        </nav>

        <app-project-detail-view *ngIf="project() as p" [project]="p" mode="page" />

        <div *ngIf="!project()" class="text-center py-16">
          <h1 class="text-2xl font-semibold mb-4">Project not found</h1>
          <a routerLink="/code" class="text-primary hover:underline">Back to projects</a>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ProjectDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly metaService = inject(MetaService);
  private readonly jsonLd = inject(JsonLdService);

  readonly project = signal<Project | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = projectData.find(p => p.slug === slug) ?? null;
    this.project.set(found);

    if (found) {
      const canonical = `/code/${found.slug}`;
      this.metaService.updatePageMetadata({
        title: found.title,
        description: found.description,
        ogTitle: `${found.title} | Jayden Richardson`,
        ogDescription: found.description,
        ogImage: found.imgUrl.startsWith('http') ? found.imgUrl : `https://jayrich.dev${found.imgUrl}`,
        ogType: 'article',
        canonical
      });
      this.jsonLd.setBreadcrumb([
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/code' },
        { name: found.title, url: canonical }
      ]);
      this.jsonLd.setCreativeWork(found, canonical);
    }
  }
}
