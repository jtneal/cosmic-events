import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Event, EventListResponse, EventSearchFilters, EventStatus, EventType } from '@cosmic-events/common-util';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = '/api/events'; // This will be configured based on your backend

  private currentEventSubject = new BehaviorSubject<Event | null>(null);
  public currentEvent$ = this.currentEventSubject.asObservable();

  // Get all events with optional filters
  getEvents(filters?: EventSearchFilters, page = 1, limit = 10): Observable<EventListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

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

    const events: Event[] = [
      {
        id: 'id',
        title: 'Ancient Mysteries of Egypt',
        subtitle: 'Explore the secrets of the Pharaohs',
        type: 'tour',
        description:
          "Join us on an extraordinary journey through Egypt's most mysterious sites, including the Great Pyramid, Sphinx, and hidden chambers recently discovered.",
        speakers: [
          {
            id: 'id',
            name: 'Dr. Sarah Martinez',
            link: 'https://drsarahmartinez.com/',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            biography:
              'Leading Egyptologist with 20 years of experience in pyramid research and ancient civilization studies.',
          },
        ],
        itinerary: [
          {
            id: 'id',
            title: 'Day 1: Arrival in Cairo',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Meet your guide and fellow travelers. Evening orientation and welcome dinner.',
            order: 1,
          },
          {
            id: 'id',
            title: 'Day 2: Giza Pyramid Complex',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Explore the Great Pyramid, Sphinx, and recently opened chambers with special access.',
            order: 2,
          },
        ],
        startLocation: 'Cairo, Egypt',
        endLocation: 'Cairo, Egypt',
        additionalLegs: [],
        moreInfo: [
          {
            id: 'id',
            title: 'What to Bring',
            description: 'Comfortable walking shoes, sun hat, sunscreen, camera, and a sense of wonder.',
            order: 1,
          },
        ],
        contactInfo: {
          name: 'Dr. Sarah Martinez',
          email: 'sarah@ancientmysteries.com',
          phone: '+1 (555) 555-1212',
          website: 'https://ancientmysteries.com',
        },
        pricing: {
          singleOccupancy: 4200,
          doubleOccupancy: 3500,
          currency: 'USD',
        },
        startDate: new Date('2026-03-14T00:00:00Z'),
        endDate: new Date('2026-03-24T00:00:00Z'),
        videoLink: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        featuredImage: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        isPromoted: true,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      },
      {
        id: 'id',
        title: 'Ancient Mysteries of Egypt',
        subtitle: 'Explore the secrets of the Pharaohs',
        type: 'tour',
        description:
          "Join us on an extraordinary journey through Egypt's most mysterious sites, including the Great Pyramid, Sphinx, and hidden chambers recently discovered.",
        speakers: [
          {
            id: 'id',
            name: 'Dr. Sarah Martinez',
            link: 'https://drsarahmartinez.com/',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            biography:
              'Leading Egyptologist with 20 years of experience in pyramid research and ancient civilization studies.',
          },
        ],
        itinerary: [
          {
            id: 'id',
            title: 'Day 1: Arrival in Cairo',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Meet your guide and fellow travelers. Evening orientation and welcome dinner.',
            order: 1,
          },
          {
            id: 'id',
            title: 'Day 2: Giza Pyramid Complex',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Explore the Great Pyramid, Sphinx, and recently opened chambers with special access.',
            order: 2,
          },
        ],
        startLocation: 'Cairo, Egypt',
        endLocation: 'Cairo, Egypt',
        additionalLegs: [],
        moreInfo: [
          {
            id: 'id',
            title: 'What to Bring',
            description: 'Comfortable walking shoes, sun hat, sunscreen, camera, and a sense of wonder.',
            order: 1,
          },
        ],
        contactInfo: {
          name: 'Dr. Sarah Martinez',
          email: 'sarah@ancientmysteries.com',
          phone: '+1 (555) 555-1212',
          website: 'https://ancientmysteries.com',
        },
        pricing: {
          singleOccupancy: 4200,
          doubleOccupancy: 3500,
          currency: 'USD',
        },
        startDate: new Date('2026-03-14T00:00:00Z'),
        endDate: new Date('2026-03-24T00:00:00Z'),
        videoLink: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        featuredImage: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        isPromoted: false,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      },
      {
        id: 'id',
        title: 'Ancient Mysteries of Egypt',
        subtitle: 'Explore the secrets of the Pharaohs',
        type: 'tour',
        description:
          "Join us on an extraordinary journey through Egypt's most mysterious sites, including the Great Pyramid, Sphinx, and hidden chambers recently discovered.",
        speakers: [
          {
            id: 'id',
            name: 'Dr. Sarah Martinez',
            link: 'https://drsarahmartinez.com/',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            biography:
              'Leading Egyptologist with 20 years of experience in pyramid research and ancient civilization studies.',
          },
        ],
        itinerary: [
          {
            id: 'id',
            title: 'Day 1: Arrival in Cairo',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Meet your guide and fellow travelers. Evening orientation and welcome dinner.',
            order: 1,
          },
          {
            id: 'id',
            title: 'Day 2: Giza Pyramid Complex',
            image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
            description: 'Explore the Great Pyramid, Sphinx, and recently opened chambers with special access.',
            order: 2,
          },
        ],
        startLocation: 'Cairo, Egypt',
        endLocation: 'Cairo, Egypt',
        additionalLegs: [],
        moreInfo: [
          {
            id: 'id',
            title: 'What to Bring',
            description: 'Comfortable walking shoes, sun hat, sunscreen, camera, and a sense of wonder.',
            order: 1,
          },
        ],
        contactInfo: {
          name: 'Dr. Sarah Martinez',
          email: 'sarah@ancientmysteries.com',
          phone: '+1 (555) 555-1212',
          website: 'https://ancientmysteries.com',
        },
        pricing: {
          singleOccupancy: 4200,
          doubleOccupancy: 3500,
          currency: 'USD',
        },
        startDate: new Date('2026-03-14T00:00:00Z'),
        endDate: new Date('2026-03-24T00:00:00Z'),
        videoLink: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        featuredImage: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg',
        isPromoted: false,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'authorId',
      },
    ];

    return of({ events, total: 0, page: 1, limit: 12 });

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
      { value: 'tour', label: 'Guided Tours' },
      { value: 'conference', label: 'Conferences' },
      { value: 'event', label: 'Special Events' },
    ];
  }

  getEventLocations(): { value: string; label: string }[] {
    return [
      { value: 'cairo', label: 'Cairo, Egypt' },
      { value: 'london', label: 'London, UK' },
      { value: 'new_york', label: 'New York, USA' },
    ];
  }

  // Generate unique ID (for client-side operations)
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
