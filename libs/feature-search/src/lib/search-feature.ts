import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventCard, EventCardSkeleton, Hero } from '@cosmic-events/ui-components';
import { EventDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [
    EventCard,
    EventCardSkeleton,
    Hero,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'lib-search-feature',
  styleUrl: './search-feature.scss',
  templateUrl: './search-feature.html',
})
export class SearchFeature {
  public events = httpResource<EventDto[]>(() => '/api/events');
  public isHeroHidden = localStorage.getItem('isHeroHidden') === 'true';

  public hideHero(): void {
    this.isHeroHidden = true;
    localStorage.setItem('isHeroHidden', 'true');
  }
}
