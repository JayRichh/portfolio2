import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/pages/about-page/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'code',
    loadComponent: () => import('./features/code/pages/code-page/code-page.component').then(m => m.CodePageComponent)
  },
  {
    path: 'work',
    loadComponent: () => import('./features/work/pages/work-page/work-page.component').then(m => m.WorkPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
