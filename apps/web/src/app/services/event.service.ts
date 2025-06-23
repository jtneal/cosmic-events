import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Event, EventSearchFilters, EventListResponse, EventType, EventStatus } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = '/api/events'; // This will be configured based on your backend
  
  private currentEventSubject = new BehaviorSubject<Event | null>(null);
  public currentEvent$ = this.currentEventSubject.asObservable();

  // Get all events with optional filters
  getEvents(filters?: EventSearchFilters, page: number = 1, limit: number = 10): Observable<EventListResponse> {
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

    return this.http.get<EventListResponse>(`${this.apiUrl}`, { params });
  }

  // Get promoted events
  getPromotedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/promoted`);
  }

  // Get single event by ID
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // Create new event
  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}`, event);
  }

  // Update existing event
  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  // Delete event
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Change event status
  changeEventStatus(id: string, status: EventStatus): Observable<Event> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Publish event
  publishEvent(id: string): Observable<Event> {
    return this.changeEventStatus(id, 'published');
  }

  // Unpublish event (move to draft)
  unpublishEvent(id: string): Observable<Event> {
    return this.changeEventStatus(id, 'draft');
  }

  // Get user's events
  getUserEvents(status?: EventStatus): Observable<Event[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Event[]>(`${this.apiUrl}/my-events`, { params });
  }

  // Upload image
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
  }

  // Set current event for editing
  setCurrentEvent(event: Event | null): void {
    this.currentEventSubject.next(event);
  }

  // Get event types
  getEventTypes(): { value: EventType; label: string }[] {
    return [
      { value: 'event', label: 'Guided Events' },
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