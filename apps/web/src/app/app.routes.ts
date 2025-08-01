import { Route } from '@angular/router';
import { Home } from '@cosmic-events/feature-home';
import { CreateEventComponent } from './pages/create-event/create-event.component';

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'create', component: CreateEventComponent },
  { path: 'my-events', loadComponent: () => import('./pages/my-events/my-events.component').then(m => m.MyEventsComponent) },
  { path: 'event/:id', loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: '**', redirectTo: '' }
];
