import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '@cosmic-events/data-access';
import { map, shareReplay, switchMap } from 'rxjs';

@Component({
  imports: [
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
  ],
  selector: 'lib-view-feature',
  styleUrl: './view-feature.scss',
  templateUrl: './view-feature.html',
})
export class ViewFeature {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EventService);

  public event$ = this.route.paramMap.pipe(
    map((params) => params.get('eventId') ?? ''),
    switchMap((eventId) => this.service.getEvent(eventId)),
    shareReplay(1),
    takeUntilDestroyed(),
  );

  public duration$ = this.event$.pipe(
    map((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / 86_400_000); // 1000 * 60 * 60 * 24

      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }),
  );

  public eventTypeIcons: Record<string, string> = {
    Conventions: 'groups',
    'Cruise Experiences': 'directions_boat',
    'Guided Tours': 'tour',
  };
}
