import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [MatCardModule],
  selector: 'lib-event-card-skeleton',
  styleUrl: './event-card-skeleton.scss',
  templateUrl: './event-card-skeleton.html',
})
export class EventCardSkeleton {}
