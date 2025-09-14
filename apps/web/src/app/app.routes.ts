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
    loadComponent: () => import('@cosmic-events/feature-edit').then((m) => m.EditFeature),
    path: 'edit/:eventId',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-view').then((m) => m.ViewFeature),
    path: 'events/:eventId/:slug',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-manage').then((m) => m.ManageFeature),
    path: 'manage',
  },
  {
    loadComponent: () => import('@cosmic-events/feature-report').then((m) => m.ReportFeature),
    path: 'manage/report',
  },
];
