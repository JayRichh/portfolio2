export interface PageMetadata {
  readonly title?: string;
  readonly description?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly ogImage?: string;
  readonly ogType?: 'website' | 'article';
  readonly twitterTitle?: string;
  readonly twitterDescription?: string;
  readonly twitterImage?: string;
  readonly canonical?: string;
}

export interface JsonLdBreadcrumbItem {
  readonly name: string;
  readonly url: string;
}

export interface RouteMeta {
  readonly meta: PageMetadata;
  readonly breadcrumbs?: readonly JsonLdBreadcrumbItem[];
  readonly schema?: 'person' | 'website' | 'article';
}
