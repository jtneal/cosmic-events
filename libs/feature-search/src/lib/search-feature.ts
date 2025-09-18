import { httpResource } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventCard, EventCardSkeleton, Hero } from '@cosmic-events/ui-components';
import { EventDto } from '@cosmic-events/util-dtos';
import { debounceTime } from 'rxjs';

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
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'lib-search-feature',
  styleUrl: './search-feature.scss',
  templateUrl: './search-feature.html',
})
export class SearchFeature implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly queryParams = signal('');

  public readonly events = httpResource<EventDto[]>(() => `/api/events${this.queryParams()}`);
  public readonly locations = httpResource<string[]>(() => '/api/locations');
  public isHeroHidden = localStorage.getItem('isHeroHidden') === 'true';

  public readonly form = this.formBuilder.group({
    location: [''],
    startDate: [''],
    endDate: [''],
    search: [''],
    type: [''],
    sort: [''],
  });

  private readonly formChange$ = this.form.valueChanges.pipe(debounceTime(250), takeUntilDestroyed());

  public ngOnInit(): void {
    this.formChange$.subscribe((formValue) => {
      this.setQueryParams({ ...formValue, location: JSON.stringify(formValue.location) } as Record<string, string>);
    });
  }

  public hideHero(): void {
    this.isHeroHidden = true;
    localStorage.setItem('isHeroHidden', 'true');
  }

  private setQueryParams(formValue: Record<string, string>): void {
    this.queryParams.set(`?${new URLSearchParams(formValue).toString()}`);
  }
}
