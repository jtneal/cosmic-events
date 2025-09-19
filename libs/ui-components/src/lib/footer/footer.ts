import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [MatButtonModule, MatIconModule, RouterModule],
  selector: 'lib-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  public user = input.required<UserDto | null>();
  public year = new Date().getFullYear();
}
