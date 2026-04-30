import { Injectable, inject } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { MetaService } from '../services/meta.service';
import { JsonLdService } from '../services/json-ld.service';
import { RouteMeta, PageMetadata, JsonLdBreadcrumbItem } from '../models/page-metadata.model';

@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly metaService = inject(MetaService);
  private readonly jsonLd = inject(JsonLdService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const data = this.collectRouteMeta(snapshot.root);
    const meta = data.meta ?? this.fallbackMeta(snapshot.url);

    this.metaService.updatePageMetadata(meta);
    this.jsonLd.setPerson();
    this.jsonLd.setWebSite();
    this.jsonLd.setBreadcrumb(data.breadcrumbs ?? []);
  }

  private collectRouteMeta(route: ActivatedRouteSnapshot): { meta?: PageMetadata; breadcrumbs?: readonly JsonLdBreadcrumbItem[] } {
    let result: RouteMeta | undefined;
    let cursor: ActivatedRouteSnapshot | null = route;
    while (cursor) {
      const candidate = cursor.data as Partial<RouteMeta>;
      if (candidate.meta) result = { ...result, ...(candidate as RouteMeta) };
      cursor = cursor.firstChild;
    }
    return { meta: result?.meta, breadcrumbs: result?.breadcrumbs };
  }

  private fallbackMeta(url: string): PageMetadata {
    return { canonical: url || '/' };
  }
}
