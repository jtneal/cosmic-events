import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserDto } from '@cosmic-events/util-dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  public getUser(): Observable<UserDto> {
    return this.http.get<UserDto>('/api/auth/user');
  }
}
