import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tour, TourSearchFilters, TourListResponse, TourType, TourStatus } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tours'; // This will be configured based on your backend
  
  private currentTourSubject = new BehaviorSubject<Tour | null>(null);
  public currentTour$ = this.currentTourSubject.asObservable();

  // Get all tours with optional filters
  getTours(filters?: TourSearchFilters, page: number = 1, limit: number = 10): Observable<TourListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.type) {
        params = params.set('type', filters.type);
      }
      if (filters.searchTerm) {
        params = params.set('search', filters.searchTerm);
      }
      if (filters.promoted !== undefined) {
        params = params.set('promoted', filters.promoted.toString());
      }
      if (filters.dateRange) {
        params = params.set('startDate', filters.dateRange.start.toISOString());
        params = params.set('endDate', filters.dateRange.end.toISOString());
      }
      if (filters.priceRange) {
        params = params.set('minPrice', filters.priceRange.min.toString());
        params = params.set('maxPrice', filters.priceRange.max.toString());
      }
    }

    return this.http.get<TourListResponse>(`${this.apiUrl}`, { params });
  }

  // Get promoted tours
  getPromotedTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/promoted`);
  }

  // Get single tour by ID
  getTour(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }

  // Create new tour
  createTour(tour: Partial<Tour>): Observable<Tour> {
    return this.http.post<Tour>(`${this.apiUrl}`, tour);
  }

  // Update existing tour
  updateTour(id: string, tour: Partial<Tour>): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/${id}`, tour);
  }

  // Delete tour
  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Change tour status
  changeTourStatus(id: string, status: TourStatus): Observable<Tour> {
    return this.http.patch<Tour>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Publish tour
  publishTour(id: string): Observable<Tour> {
    return this.changeTourStatus(id, 'published');
  }

  // Unpublish tour (move to draft)
  unpublishTour(id: string): Observable<Tour> {
    return this.changeTourStatus(id, 'draft');
  }

  // Get user's tours
  getUserTours(status?: TourStatus): Observable<Tour[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Tour[]>(`${this.apiUrl}/my-tours`, { params });
  }

  // Upload image
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
  }

  // Set current tour for editing
  setCurrentTour(tour: Tour | null): void {
    this.currentTourSubject.next(tour);
  }

  // Get tour types
  getTourTypes(): { value: TourType; label: string }[] {
    return [
      { value: 'tour', label: 'Guided Tours' },
      { value: 'conference', label: 'Conferences' },
      { value: 'meeting', label: 'Meetings & Workshops' },
      { value: 'cruise', label: 'Cruise Expeditions' },
      { value: 'event', label: 'Special Events' }
    ];
  }

  // Generate unique ID (for client-side operations)
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}