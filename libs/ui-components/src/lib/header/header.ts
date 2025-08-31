import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { UserDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [MatButtonModule, RouterModule],
  providers: [],
  selector: 'lib-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  public user = input.required<UserDto | null>();
}
