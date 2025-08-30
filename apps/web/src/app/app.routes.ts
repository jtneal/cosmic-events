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
    loadComponent: () => import('@cosmic-events/feature-contact').then((m) => m.ContactFeature),
    path: 'contact',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-sign-in').then((m) => m.SignInFeature),
    path: 'sign-in',
  },
];
