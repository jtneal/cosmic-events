import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateEventComponent },
  { path: 'my-events', loadComponent: () => import('./pages/my-events/my-events.component').then(m => m.MyEventsComponent) },
  { path: 'event/:id', loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: '**', redirectTo: '' }
];
