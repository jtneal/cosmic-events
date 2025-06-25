import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Hero } from '@cosmic-events/home-ui';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { Event, EventSearchFilters, EventType } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <lib-hero />

      <!-- Search & Filters -->
      <section class="search-section" #eventsSection>
        <div class="search-container">
          <h2>Find Your Perfect Adventure</h2>
          <div class="search-form">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search events, locations, topics...</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Atlantis, UFO sightings, Ancient Egypt..." />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Event Type</mat-label>
              <mat-select [(ngModel)]="selectedType">
                <mat-option value="">All Types</mat-option>
                @for (type of eventTypes; track type.value) {
                <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="searchEvents()">
              <mat-icon>search</mat-icon>
              Search
            </button>
          </div>
        </div>
      </section>

      <!-- Promoted Events -->
      @if (promotedEvents().length > 0) {
      <section class="promoted-section">
        <div class="section-header">
          <h2>
            <mat-icon>star</mat-icon>
            Featured & Promoted Events
          </h2>
          <p>Discover highlighted adventures from our community</p>
        </div>
        <div class="events-grid promoted-grid">
          @for (event of promotedEvents(); track event.id) {
          <app-event-card [event]="event" />
          }
        </div>
      </section>
      }

      <!-- All Events -->
      <section class="events-section">
        <div class="section-header">
          <h2>
            <mat-icon>explore</mat-icon>
            All Adventures
          </h2>
          <p>{{ totalEvents() }} cosmic adventures await</p>
        </div>

        @if (loading()) {
        <div class="loading-state">
          <div class="cosmic-loader">
            <div class="planet"></div>
            <div class="orbit"></div>
          </div>
          <p>Loading cosmic adventures...</p>
        </div>
        } @else if (events().length === 0) {
        <div class="empty-state">
          <mat-icon>explore_off</mat-icon>
          <h3>No events found</h3>
          <p>Try adjusting your search criteria or be the first to create a event!</p>
          <button mat-raised-button color="primary" routerLink="/create">
            <mat-icon>add</mat-icon>
            Create First Event
          </button>
        </div>
        } @else {
        <div class="events-grid">
          @for (event of events(); track event.id) {
          <app-event-card [event]="event" />
          }
        </div>

        @if (hasMoreEvents()) {
        <div class="load-more">
          <button mat-raised-button color="primary" (click)="loadMoreEvents()" [disabled]="loading()">
            <mat-icon>expand_more</mat-icon>
            Load More Events
          </button>
        </div>
        } }
      </section>

      <!-- Categories -->
      <section class="categories-section">
        <div class="section-header">
          <h2>Popular Categories</h2>
          <p>Explore adventures by theme</p>
        </div>
        <div class="categories-grid">
          <div class="category-card" (click)="filterByCategory('ancient')">
            <mat-icon>account_balance</mat-icon>
            <h3>Ancient Civilizations</h3>
            <p>Explore lost cities, mysterious ruins, and forgotten empires</p>
          </div>
          <div class="category-card" (click)="filterByCategory('ufo')">
            <mat-icon>brightness_2</mat-icon>
            <h3>UFO & UAP</h3>
            <p>Investigate sightings, hotspots, and unexplained phenomena</p>
          </div>
          <div class="category-card" (click)="filterByCategory('paranormal')">
            <mat-icon>psychology</mat-icon>
            <h3>Paranormal</h3>
            <p>Ghost events, cryptozoology, and supernatural experiences</p>
          </div>
          <div class="category-card" (click)="filterByCategory('spiritual')">
            <mat-icon>self_improvement</mat-icon>
            <h3>Spiritual & New Age</h3>
            <p>Consciousness expansion, healing journeys, and sacred sites</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .search-section {
        background: rgba(26, 26, 62, 0.5);
        padding: 3rem 0;
        margin: 2rem 0;
        border-radius: 16px;
        backdrop-filter: blur(10px);
        border: 1px solid var(--cosmic-border);
      }

      .search-container {
        text-align: center;
      }

      .search-container h2 {
        font-family: 'Orbitron', monospace;
        margin-bottom: 2rem;
        color: var(--cosmic-text);
      }

      .search-form {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: end;
        max-width: 800px;
        margin: 0 auto;
        flex-wrap: wrap;
      }

      .search-field {
        flex: 2;
        min-width: 250px;
      }

      .search-form mat-form-field {
        flex: 1;
        min-width: 150px;
      }

      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .section-header h2 {
        font-family: 'Orbitron', monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .section-header p {
        color: var(--cosmic-text-secondary);
        font-size: 1.1rem;
      }

      .promoted-section {
        margin: 4rem 0;
      }

      .promoted-grid {
        position: relative;
      }

      .promoted-grid::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        background: linear-gradient(45deg, var(--cosmic-accent), var(--cosmic-primary));
        border-radius: 20px;
        z-index: -1;
        opacity: 0.1;
      }

      .events-section {
        margin: 4rem 0;
      }

      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .loading-state,
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-state mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: var(--cosmic-text-secondary);
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        margin-bottom: 1rem;
        color: var(--cosmic-text);
      }

      .load-more {
        text-align: center;
        margin-top: 2rem;
      }

      .categories-section {
        margin: 6rem 0;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .category-card {
        background: rgba(26, 26, 62, 0.6);
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid var(--cosmic-border);
      }

      .category-card:hover {
        transform: translateY(-4px);
        background: rgba(26, 26, 62, 0.8);
        border-color: var(--cosmic-primary);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
      }

      .category-card mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--cosmic-primary);
        margin-bottom: 1rem;
      }

      .category-card h3 {
        margin-bottom: 1rem;
        color: var(--cosmic-text);
      }

      .category-card p {
        color: var(--cosmic-text-secondary);
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .search-form {
          flex-direction: column;
        }

        .events-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .categories-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  imports: [
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
    EventCardComponent,
  ],
})
export class HomeComponent implements OnInit {
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
