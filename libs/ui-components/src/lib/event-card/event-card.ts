import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import type { EventDto } from '@cosmic-events/util-dtos';
import { ConfirmDelete } from '../confirm-delete/confirm-delete';
import { SlugifyPipe } from '../slugify/slugify.pipe';

@Component({
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    RouterModule,
    SlugifyPipe,
  ],
  selector: 'lib-event-card',
  styleUrl: './event-card.scss',
  templateUrl: './event-card.html',
})
export class EventCard {
  private readonly dialog = inject(MatDialog);

  public event = input.required<EventDto>();
  public showManagementLinks = input(false);
  public delete = output<string>();

  public get duration(): string {
    const start = new Date(this.event().startDate);
    const end = new Date(this.event().endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / 86_400_000) + 1; // 1000 * 60 * 60 * 24

    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  public eventTypeIcons: Record<string, string> = {
    Conventions: 'groups',
    'Cruise Experiences': 'directions_boat',
    'Guided Tours': 'tour',
  };

  public deleteEvent(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDelete);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.delete.emit(id);
      }
    });
  }
}
