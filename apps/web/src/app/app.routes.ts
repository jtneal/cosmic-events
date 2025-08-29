import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    loadComponent: () => import('@cosmic-events/feature-search').then((m) => m.SearchFeature),
    path: '',
  },
];
