import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { EventService } from '@cosmic-events/data-access-common';
import { Event, EventStatus } from '@cosmic-events/util-common';
import { EventCard } from '@cosmic-events/ui-home';

@Component({
  selector: 'app-my-events',
  template: `
    <div class="my-events-container">
      <div class="header-section">
        <h1 class="cosmic-title">My Events</h1>
        <p class="subtitle">Manage your cosmic adventures</p>
        <button mat-raised-button color="primary" routerLink="/create" class="create-button">
          <mat-icon>add</mat-icon>
          Create New Event
        </button>
      </div>

      <mat-tab-group class="events-tabs" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Published">
          <div class="tab-content">
            @if (loading()) {
              <div class="loading-state">
                <div class="cosmic-loader">
                  <div class="planet"></div>
                  <div class="orbit"></div>
                </div>
                <p>Loading your published events...</p>
              </div>
            } @else if (publishedEvents().length === 0) {
              <div class="empty-state">
                <mat-icon>public_off</mat-icon>
                <h3>No Published Events</h3>
                <p>You haven't published any events yet. Create your first cosmic adventure!</p>
                <button mat-raised-button color="primary" routerLink="/create">
                  <mat-icon>add</mat-icon>
                  Create Your First Event
                </button>
              </div>
            } @else {
              <div class="events-grid">
                @for (event of publishedEvents(); track event.id) {
                  <lib-event-card [event]="event" />
                }
              </div>
            }
          </div>
        </mat-tab>

        <mat-tab label="Drafts">
          <div class="tab-content">
            @if (loading()) {
              <div class="loading-state">
                <div class="cosmic-loader">
                  <div class="planet"></div>
                  <div class="orbit"></div>
                </div>
                <p>Loading your draft events...</p>
              </div>
            } @else if (draftEvents().length === 0) {
              <div class="empty-state">
                <mat-icon>drafts</mat-icon>
                <h3>No Draft Events</h3>
                <p>You don't have any draft events. Start creating your next adventure!</p>
                <button mat-raised-button color="primary" routerLink="/create">
                  <mat-icon>add</mat-icon>
                  Create New Event
                </button>
              </div>
            } @else {
              <div class="events-grid">
                @for (event of draftEvents(); track event.id) {
                  <lib-event-card [event]="event" />
                }
              </div>
            }
          </div>
        </mat-tab>

        <mat-tab label="Archived">
          <div class="tab-content">
            @if (loading()) {
              <div class="loading-state">
                <div class="cosmic-loader">
                  <div class="planet"></div>
                  <div class="orbit"></div>
                </div>
                <p>Loading your archived events...</p>
              </div>
            } @else if (archivedEvents().length === 0) {
              <div class="empty-state">
                <mat-icon>archive</mat-icon>
                <h3>No Archived Events</h3>
                <p>You don't have any archived events.</p>
              </div>
            } @else {
              <div class="events-grid">
                @for (event of archivedEvents(); track event.id) {
                  <lib-event-card [event]="event" />
                }
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .my-events-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .header-section {
        text-align: center;
        margin-bottom: 3rem;
        position: relative;
      }

      .subtitle {
        font-size: 1.2rem;
        color: var(--cosmic-text-secondary);
        margin: 0.5rem 0 2rem;
      }

      .create-button {
        background: var(--cosmic-gradient);
        color: white;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        transition: all 0.3s ease;
      }

      .create-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
      }

      .events-tabs {
        background: rgba(26, 26, 62, 0.6);
        border-radius: 16px;
        padding: 1rem;
        backdrop-filter: blur(10px);
        border: 1px solid var(--cosmic-border);
      }

      .tab-content {
        padding: 2rem 0;
        min-height: 400px;
      }

      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .loading-state,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
      }

      .empty-state mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: var(--cosmic-text-secondary);
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        color: var(--cosmic-text);
        margin-bottom: 1rem;
        font-family: 'Orbitron', monospace;
      }

      .empty-state p {
        color: var(--cosmic-text-secondary);
        margin-bottom: 2rem;
        max-width: 400px;
        line-height: 1.6;
      }

      .cosmic-loader {
        position: relative;
        width: 60px;
        height: 60px;
        margin-bottom: 20px;
      }

      .planet {
        width: 20px;
        height: 20px;
        background: var(--cosmic-accent);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px var(--cosmic-accent);
      }

      .orbit {
        width: 60px;
        height: 60px;
        border: 2px solid var(--cosmic-primary);
        border-radius: 50%;
        border-top: 2px solid transparent;
        animation: orbit 2s linear infinite;
      }

      @keyframes orbit {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-state p,
      .empty-state p {
        color: var(--cosmic-text-secondary);
      }

      @media (max-width: 768px) {
        .my-events-container {
          padding: 0 0.5rem;
        }

        .events-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .tab-content {
          padding: 1rem 0;
        }
      }

      /* Material Theming */
      ::ng-deep .mat-mdc-tab-group {
        --mdc-tab-indicator-active-indicator-color: var(--cosmic-primary);
        --mdc-secondary-navigation-tab-label-text-color: var(--cosmic-text-secondary);
        --mdc-secondary-navigation-tab-active-label-text-color: var(--cosmic-primary);
      }

      ::ng-deep .mat-mdc-tab {
        color: var(--cosmic-text-secondary);
      }

      ::ng-deep .mat-mdc-tab:hover {
        color: var(--cosmic-primary);
      }

      ::ng-deep .mat-mdc-tab.mdc-tab--active {
        color: var(--cosmic-primary);
      }

      ::ng-deep .mat-mdc-tab-body-content {
        overflow: visible;
      }

      ::ng-deep .mat-mdc-tab-header {
        border-bottom: 1px solid var(--cosmic-border);
      }
    `,
  ],
  imports: [CommonModule, RouterModule, MatTabsModule, MatButtonModule, MatIconModule, MatSnackBarModule, EventCard],
})
export class MyEventsComponent implements OnInit {
  private eventService = inject(EventService);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  publishedEvents = signal<Event[]>([]);
  draftEvents = signal<Event[]>([]);
  archivedEvents = signal<Event[]>([]);
  loading = signal(false);
  currentTab = signal(0);

  ngOnInit(): void {
    this.loadEvents('published');
  }

  onTabChange(event: any): void {
    this.currentTab.set(event.index);
    const statuses: EventStatus[] = ['published', 'draft', 'archived'];
    this.loadEvents(statuses[event.index]);
  }

  private loadEvents(status: EventStatus): void {
    this.loading.set(true);

    this.eventService.getUserEvents(status).subscribe({
      next: (events) => {
        switch (status) {
          case 'published':
            this.publishedEvents.set(events);
            break;
          case 'draft':
            this.draftEvents.set(events);
            break;
          case 'archived':
            this.archivedEvents.set(events);
            break;
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error(`Error loading ${status} events:`, error);
        this.loading.set(false);
        this.snackBar.open(`Error loading ${status} events`, 'Close', { duration: 3000 });
      },
    });
  }

  editEvent(event: Event): void {
    this.eventService.setCurrentEvent(event);
    // Navigate to edit mode - this would be implemented with route params
    // For now, we'll just show a message
    this.snackBar.open('Edit functionality will be implemented with route parameters', 'Close', { duration: 3000 });
  }

  toggleEventStatus(event: Event): void {
    const newStatus: EventStatus = event.status === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';

    this.loading.set(true);

    this.eventService.changeEventStatus(event.id, newStatus).subscribe({
      next: (updatedEvent) => {
        // Update the event in the appropriate array
        this.updateEventInArrays(updatedEvent);
        this.loading.set(false);

        const message = newStatus === 'published' ? 'Event published successfully!' : 'Event moved to drafts!';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error(`Error ${action}ing event:`, error);
        this.loading.set(false);
        this.snackBar.open(`Error ${action}ing event`, 'Close', { duration: 3000 });
      },
    });
  }

  private updateEventInArrays(updatedEvent: Event): void {
    // Remove from all arrays
    this.publishedEvents.update((events) => events.filter((t) => t.id !== updatedEvent.id));
    this.draftEvents.update((events) => events.filter((t) => t.id !== updatedEvent.id));
    this.archivedEvents.update((events) => events.filter((t) => t.id !== updatedEvent.id));

    // Add to appropriate array
    switch (updatedEvent.status) {
      case 'published':
        this.publishedEvents.update((events) => [updatedEvent, ...events]);
        break;
      case 'draft':
        this.draftEvents.update((events) => [updatedEvent, ...events]);
        break;
      case 'archived':
        this.archivedEvents.update((events) => [updatedEvent, ...events]);
        break;
    }
  }
}
