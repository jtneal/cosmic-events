import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  selector: 'lib-event-card',
  styleUrl: './event-card.scss',
  templateUrl: './event-card.html',
})
export class EventCard {
  public showManagementLinks = input(false);
}
