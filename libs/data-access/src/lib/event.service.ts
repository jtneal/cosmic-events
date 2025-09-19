import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EventDto } from '@cosmic-events/util-dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);

  public getEvent(eventId: string): Observable<EventDto> {
    return this.http.get<EventDto>(`/api/events/${eventId}`);
  }

  public getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>('/api/events');
  }

  public getUserEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>('/api/user/events');
  }

  public getUserEvent(eventId: string): Observable<EventDto> {
    return this.http.get<EventDto>(`/api/user/events/${eventId}`);
  }

  public postEvent(event: FormData): Observable<void> {
    return this.http.post<void>('/api/events', event);
  }

  public deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`/api/events/${eventId}`);
  }
}
