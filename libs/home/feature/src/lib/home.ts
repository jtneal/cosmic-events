import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '@cosmic-events/common-data-access';
import { Event, EventSearchFilters, EventType } from '@cosmic-events/common-util';
import { CategoryCard, EventCard, Hero, Search } from '@cosmic-events/home-ui';

@Component({
  selector: 'lib-home',
  imports: [
    CategoryCard,
    CommonModule,
    FormsModule,
    Hero,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    EventCard,
    Search,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private eventService = inject(EventService);

  // Signals for reactive state management
  events = signal<Event[]>([]);
  promotedEvents = signal<Event[]>([]);
  loading = signal(false);
  totalEvents = signal(0);
  currentPage = signal(1);
  hasMoreEvents = computed(() => this.events().length < this.totalEvents());

  // Search and filter state
  searchTerm = '';
  selectedType: EventType | '' = '';
  eventTypes = this.eventService.getEventTypes();

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loading.set(true);

    // Load promoted events
    this.eventService.getPromotedEvents().subscribe({
      next: (promoted) => this.promotedEvents.set(promoted),
      error: (error) => console.error('Error loading promoted events:', error),
    });

    // Load regular events
    this.eventService.getEvents({}, 1, 12).subscribe({
      next: (response) => {
        this.events.set(response.events);
        this.totalEvents.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading.set(false);
      },
    });
  }

  searchEvents(): void {
    this.loading.set(true);
    this.currentPage.set(1);

    const filters: EventSearchFilters = {};
    if (this.searchTerm.trim()) {
      filters.searchTerm = this.searchTerm.trim();
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }

    this.eventService.getEvents(filters, 1, 12).subscribe({
      next: (response) => {
        this.events.set(response.events);
        this.totalEvents.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching events:', error);
        this.loading.set(false);
      },
    });
  }

  loadMoreEvents(): void {
    if (this.loading() || !this.hasMoreEvents()) return;

    this.loading.set(true);
    const nextPage = this.currentPage() + 1;

    const filters: EventSearchFilters = {};
    if (this.searchTerm.trim()) {
      filters.searchTerm = this.searchTerm.trim();
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }

    this.eventService.getEvents(filters, nextPage, 12).subscribe({
      next: (response) => {
        this.events.update((current) => [...current, ...response.events]);
        this.currentPage.set(nextPage);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading more events:', error);
        this.loading.set(false);
      },
    });
  }

  filterByCategory(category: string): void {
    this.searchTerm = category;
    this.searchEvents();
    this.scrollToEvents();
  }

  scrollToEvents(): void {
    const element = document.querySelector('.search-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
