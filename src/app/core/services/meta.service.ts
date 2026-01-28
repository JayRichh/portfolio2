import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class MetaService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly baseUrl = 'https://jayrich.dev';
  private readonly defaultTitle = 'Jayden Richardson | Full Stack Web Developer';
  private readonly defaultDescription = 'Full Stack Web Developer specializing in React, TypeScript, and modern web technologies. Explore my portfolio of interactive web applications, development tools, and technical resources.';
  private readonly defaultImage = `${this.baseUrl}/JRLOGO.png`;

  updatePageMetadata(metadata: PageMetadata): void {
    const title = metadata.title
      ? `${metadata.title} | Jayden Richardson`
      : this.defaultTitle;

    const description = metadata.description || this.defaultDescription;
    const ogTitle = metadata.ogTitle || title;
    const ogDescription = metadata.ogDescription || description;
    const ogImage = metadata.ogImage || this.defaultImage;
    const twitterTitle = metadata.twitterTitle || title;
    const twitterDescription = metadata.twitterDescription || description;
    const twitterImage = metadata.twitterImage || ogImage;

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });

    if (metadata.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metadata.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:url', content: metadata.canonical || this.baseUrl });

    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.meta.updateTag({ name: 'twitter:image', content: twitterImage });

    if (metadata.canonical) {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.setAttribute('href', `${this.baseUrl}${metadata.canonical}`);
      } else {
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', `${this.baseUrl}${metadata.canonical}`);
        document.head.appendChild(link);
      }
    }
  }

  setDefaultMetadata(): void {
    this.updatePageMetadata({
      title: this.defaultTitle,
      description: this.defaultDescription,
    });
  }
}
