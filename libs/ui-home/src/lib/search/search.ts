import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

export type EventType = 'tour' | 'conference' | 'meeting' | 'cruise' | 'event';

@Component({
  selector: 'lib-search',
  imports: [FormsModule, MatFormField, MatIcon, MatInput, MatLabel, MatOption, MatSelect],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  eventTypes = input.required<{ value: EventType; label: string }[]>();

  searchTerm = '';
  selectedType = '' as EventType;

  searchEvents(): void {
    // @TODO: Implement search logic
  }
}
