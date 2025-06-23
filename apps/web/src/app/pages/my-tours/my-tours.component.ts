import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TourService } from '../../services/tour.service';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { Tour, TourStatus } from '../../models/tour.model';

@Component({
  selector: 'app-my-tours',
  template: `
    <div class="my-tours-container">
      <div class="header-section">
        <h1 class="cosmic-title">My Tours</h1>
        <p class="subtitle">Manage your cosmic adventures</p>
        <button mat-raised-button color="primary" routerLink="/create" class="create-button">
          <mat-icon>add</mat-icon>
          Create New Tour
        </button>
      </div>

      <mat-tab-group class="tours-tabs" (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Published">
          <div class="tab-content">
            @if (loading()) {
              <div class="loading-state">
                <div class="cosmic-loader">
                  <div class="planet"></div>
                  <div class="orbit"></div>
                </div>
                <p>Loading your published tours...</p>
              </div>
            } @else if (publishedTours().length === 0) {
              <div class="empty-state">
                <mat-icon>public_off</mat-icon>
                <h3>No Published Tours</h3>
                <p>You haven't published any tours yet. Create your first cosmic adventure!</p>
                <button mat-raised-button color="primary" routerLink="/create">
                  <mat-icon>add</mat-icon>
                  Create Your First Tour
                </button>
              </div>
            } @else {
              <div class="tours-grid">
                @for (tour of publishedTours(); track tour.id) {
                  <app-tour-card 
                    [tour]="tour" 
                    [showEditActions]="true"
                    (edit)="editTour($event)"
                    (toggleStatus)="toggleTourStatus($event)" />
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
                <p>Loading your draft tours...</p>
              </div>
            } @else if (draftTours().length === 0) {
              <div class="empty-state">
                <mat-icon>drafts</mat-icon>
                <h3>No Draft Tours</h3>
                <p>You don't have any draft tours. Start creating your next adventure!</p>
                <button mat-raised-button color="primary" routerLink="/create">
                  <mat-icon>add</mat-icon>
                  Create New Tour
                </button>
              </div>
            } @else {
              <div class="tours-grid">
                @for (tour of draftTours(); track tour.id) {
                  <app-tour-card 
                    [tour]="tour" 
                    [showEditActions]="true"
                    (edit)="editTour($event)"
                    (toggleStatus)="toggleTourStatus($event)" />
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
                <p>Loading your archived tours...</p>
              </div>
            } @else if (archivedTours().length === 0) {
              <div class="empty-state">
                <mat-icon>archive</mat-icon>
                <h3>No Archived Tours</h3>
                <p>You don't have any archived tours.</p>
              </div>
            } @else {
              <div class="tours-grid">
                @for (tour of archivedTours(); track tour.id) {
                  <app-tour-card 
                    [tour]="tour" 
                    [showEditActions]="true"
                    (edit)="editTour($event)"
                    (toggleStatus)="toggleTourStatus($event)" />
                }
              </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .my-tours-container {
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

    .tours-tabs {
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

    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .loading-state, .empty-state {
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
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state p, .empty-state p {
      color: var(--cosmic-text-secondary);
    }

    @media (max-width: 768px) {
      .my-tours-container {
        padding: 0 0.5rem;
      }

      .tours-grid {
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
  `],
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TourCardComponent
  ]
})
export class MyToursComponent implements OnInit {
  private tourService = inject(TourService);
  private snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  publishedTours = signal<Tour[]>([]);
  draftTours = signal<Tour[]>([]);
  archivedTours = signal<Tour[]>([]);
  loading = signal(false);
  currentTab = signal(0);

  ngOnInit(): void {
    this.loadTours('published');
  }

  onTabChange(event: any): void {
    this.currentTab.set(event.index);
    const statuses: TourStatus[] = ['published', 'draft', 'archived'];
    this.loadTours(statuses[event.index]);
  }

  private loadTours(status: TourStatus): void {
    this.loading.set(true);
    
    this.tourService.getUserTours(status).subscribe({
      next: (tours) => {
        switch (status) {
          case 'published':
            this.publishedTours.set(tours);
            break;
          case 'draft':
            this.draftTours.set(tours);
            break;
          case 'archived':
            this.archivedTours.set(tours);
            break;
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error(`Error loading ${status} tours:`, error);
        this.loading.set(false);
        this.snackBar.open(`Error loading ${status} tours`, 'Close', { duration: 3000 });
      }
    });
  }

  editTour(tour: Tour): void {
    this.tourService.setCurrentTour(tour);
    // Navigate to edit mode - this would be implemented with route params
    // For now, we'll just show a message
    this.snackBar.open('Edit functionality will be implemented with route parameters', 'Close', { duration: 3000 });
  }

  toggleTourStatus(tour: Tour): void {
    const newStatus: TourStatus = tour.status === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';
    
    this.loading.set(true);
    
    this.tourService.changeTourStatus(tour.id, newStatus).subscribe({
      next: (updatedTour) => {
        // Update the tour in the appropriate array
        this.updateTourInArrays(updatedTour);
        this.loading.set(false);
        
        const message = newStatus === 'published' ? 
          'Tour published successfully!' : 
          'Tour moved to drafts!';
        this.snackBar.open(message, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error(`Error ${action}ing tour:`, error);
        this.loading.set(false);
        this.snackBar.open(`Error ${action}ing tour`, 'Close', { duration: 3000 });
      }
    });
  }

  private updateTourInArrays(updatedTour: Tour): void {
    // Remove from all arrays
    this.publishedTours.update(tours => tours.filter(t => t.id !== updatedTour.id));
    this.draftTours.update(tours => tours.filter(t => t.id !== updatedTour.id));
    this.archivedTours.update(tours => tours.filter(t => t.id !== updatedTour.id));

    // Add to appropriate array
    switch (updatedTour.status) {
      case 'published':
        this.publishedTours.update(tours => [updatedTour, ...tours]);
        break;
      case 'draft':
        this.draftTours.update(tours => [updatedTour, ...tours]);
        break;
      case 'archived':
        this.archivedTours.update(tours => [updatedTour, ...tours]);
        break;
    }
  }
}