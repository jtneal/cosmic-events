import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserDto } from '@cosmic-events/util-dtos';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private cache$?: Observable<UserDto>;
  private readonly http = inject(HttpClient);

  public getUser(): Observable<UserDto> {
    if (!this.cache$) {
      this.cache$ = this.http.get<UserDto>('/api/user').pipe(shareReplay(1));
    }

    return this.cache$;
  }
}
