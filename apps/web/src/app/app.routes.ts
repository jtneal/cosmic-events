import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateTourComponent } from './pages/create-tour/create-tour.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateTourComponent },
  { path: 'my-tours', loadComponent: () => import('./pages/my-tours/my-tours.component').then(m => m.MyToursComponent) },
  { path: 'tour/:id', loadComponent: () => import('./pages/tour-detail/tour-detail.component').then(m => m.TourDetailComponent) },
  { path: '**', redirectTo: '' }
];
