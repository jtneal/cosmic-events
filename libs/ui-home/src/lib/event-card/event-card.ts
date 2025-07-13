import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Event } from '@cosmic-events/util-common';
import { formatDateRange, getEventTypeLabel } from '@cosmic-events/util-common';

@Component({
  selector: 'lib-event-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatBadgeModule, RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  event = input.required<Event>();
  getEventTypeLabel = getEventTypeLabel;
  formatDateRange = formatDateRange;
}
