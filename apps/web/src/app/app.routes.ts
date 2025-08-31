import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    loadComponent: () => import('@cosmic-events/feature-search').then((m) => m.SearchFeature),
    path: '',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-about').then((m) => m.AboutFeature),
    path: 'about',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-manage').then((m) => m.ManageFeature),
    path: 'manage',
  },
];
