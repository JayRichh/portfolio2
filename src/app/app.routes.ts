import { Routes } from '@angular/router';
import { RouteMeta } from './core/models/page-metadata.model';

const homeMeta: RouteMeta = {
  meta: {
    description: 'Full stack web developer specializing in Angular, React, TypeScript, and modern web technologies. View my projects and experience.',
    ogTitle: 'Jayden Richardson - Full Stack Developer',
    ogDescription: 'Experienced full stack developer building modern web applications with Angular, React, and Node.js',
    canonical: '/'
  }
};

const aboutMeta: RouteMeta = {
  meta: {
    title: 'About',
    description: 'Learn about my journey as a full stack developer, tech stack expertise, and professional experience in modern web development.',
    ogTitle: 'About Jayden Richardson',
    ogDescription: 'Full stack developer with expertise in Angular, React, Node.js, and cloud technologies',
    canonical: '/about'
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ]
};

const codeMeta: RouteMeta = {
  meta: {
    title: 'Projects',
    description: 'Web development projects showcasing Angular, React, TypeScript, and various modern web technologies.',
    ogTitle: 'Code Projects - Jayden Richardson',
    ogDescription: 'Browse my web development project portfolio',
    canonical: '/code'
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/code' }
  ]
};

const workMeta: RouteMeta = {
  meta: {
    title: 'Work Experience',
    description: 'Professional work history and projects completed across various industries and technologies.',
    ogTitle: 'Work Experience - Jayden Richardson',
    ogDescription: 'View my professional work history and project contributions',
    canonical: '/work'
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Work', url: '/work' }
  ]
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
    data: homeMeta
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/pages/about-page/about-page.component').then(m => m.AboutPageComponent),
    data: aboutMeta
  },
  {
    path: 'code',
    loadComponent: () => import('./features/code/pages/code-page/code-page.component').then(m => m.CodePageComponent),
    data: codeMeta
  },
  {
    path: 'code/:slug',
    loadComponent: () => import('./features/code/pages/project-detail-page/project-detail-page.component').then(m => m.ProjectDetailPageComponent)
  },
  {
    path: 'work',
    loadComponent: () => import('./features/work/pages/work-page/work-page.component').then(m => m.WorkPageComponent),
    data: workMeta
  },
  {
    path: '**',
    redirectTo: ''
  }
];
