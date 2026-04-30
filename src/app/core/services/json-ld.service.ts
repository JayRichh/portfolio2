import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Project } from '../../data/projectData';
import { JsonLdBreadcrumbItem } from '../models/page-metadata.model';

const BASE_URL = 'https://jayrich.dev';
const SOCIAL_LINKS = [
  'https://github.com/JayRichh',
  'https://codepen.io/jayrichh',
  'https://www.linkedin.com/in/jayden-richardson'
];

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly doc = inject(DOCUMENT);

  setPerson(): void {
    this.write('ld-person', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Jayden Richardson',
      url: BASE_URL,
      jobTitle: 'Full Stack Web Developer',
      sameAs: SOCIAL_LINKS,
      image: `${BASE_URL}/JRLOGO.png`
    });
  }

  setWebSite(): void {
    this.write('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Jayden Richardson Portfolio',
      url: BASE_URL,
      author: { '@type': 'Person', name: 'Jayden Richardson' }
    });
  }

  setBreadcrumb(items: readonly JsonLdBreadcrumbItem[]): void {
    if (items.length === 0) {
      this.clear('ld-breadcrumb');
      return;
    }
    this.write('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `${BASE_URL}${item.url}`
      }))
    });
  }

  setCreativeWork(project: Project, url: string): void {
    this.write('ld-creativework', {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: `${BASE_URL}${url}`,
      image: project.imgUrl.startsWith('http') ? project.imgUrl : `${BASE_URL}${project.imgUrl}`,
      author: { '@type': 'Person', name: 'Jayden Richardson' },
      dateModified: project.updatedAt,
      keywords: project.details.technologies
    });
  }

  clear(id: string): void {
    const existing = this.doc.getElementById(id);
    if (existing) existing.remove();
  }

  private write(id: string, data: object): void {
    const head = this.doc.head;
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
