import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EventDto } from '@cosmic-events/util-dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);

  public postEvent(event: EventDto): Observable<EventDto> {
    return this.http.post<EventDto>('/api/auth/user', event);
  }
}
