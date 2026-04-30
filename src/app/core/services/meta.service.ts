import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface PageMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

const BASE_URL = 'https://jayrich.dev';
const DEFAULT_TITLE = 'Jayden Richardson | Full Stack Web Developer';
const DEFAULT_DESCRIPTION = 'Full Stack Web Developer specializing in Angular, React, TypeScript, and modern web technologies. Explore my portfolio of interactive web applications, development tools, and technical resources.';
const DEFAULT_IMAGE = `${BASE_URL}/JRLOGO.png`;

@Injectable({ providedIn: 'root' })
export class MetaService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly doc = inject(DOCUMENT);

  updatePageMetadata(metadata: PageMetadata): void {
    const title = metadata.title
      ? `${metadata.title} | Jayden Richardson`
      : DEFAULT_TITLE;
    const description = metadata.description ?? DEFAULT_DESCRIPTION;
    const canonicalPath = metadata.canonical ?? '/';
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;
    const ogTitle = metadata.ogTitle ?? title;
    const ogDescription = metadata.ogDescription ?? description;
    const ogImage = metadata.ogImage ?? DEFAULT_IMAGE;
    const ogType = metadata.ogType ?? 'website';
    const twitterTitle = metadata.twitterTitle ?? ogTitle;
    const twitterDescription = metadata.twitterDescription ?? ogDescription;
    const twitterImage = metadata.twitterImage ?? ogImage;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: ogType });

    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.meta.updateTag({ name: 'twitter:image', content: twitterImage });

    this.setCanonical(canonicalUrl);
  }

  setDefaultMetadata(): void {
    this.updatePageMetadata({});
  }

  private setCanonical(url: string): void {
    const head = this.doc.head;
    let link = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
