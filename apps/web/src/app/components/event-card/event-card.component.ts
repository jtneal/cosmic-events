import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  template: `
    <mat-card class="event-card" [class.promoted]="event().isPromoted">
      @if (event().isPromoted) {
        <div class="promoted-badge">
          <mat-icon>star</mat-icon>
          <span>Promoted</span>
        </div>
      }
      
      <div class="card-image">
        @if (event().featuredImage) {
          <img [src]="event().featuredImage" [alt]="event().title" />
        } @else {
          <div class="placeholder-image">
            <mat-icon>explore</mat-icon>
          </div>
        }
      </div>
      
      <mat-card-content class="card-content">
        <div class="card-header">
          <mat-chip-set>
            <mat-chip class="type-chip">{{ getEventTypeLabel(event().type) }}</mat-chip>
          </mat-chip-set>
          <div class="dates">
            {{ formatDateRange(event().startDate, event().endDate) }}
          </div>
        </div>
        
        <h3 class="event-title">{{ event().title }}</h3>
        @if (event().subtitle) {
          <p class="event-subtitle">{{ event().subtitle }}</p>
        }
        
        <p class="event-description">{{ event().description | slice:0:150 }}...</p>
        
        @if (event().speakers.length > 0) {
          <div class="speakers-preview">
            <mat-icon>person</mat-icon>
            <span>{{ event().speakers.length }} speaker{{ event().speakers.length === 1 ? '' : 's' }}</span>
          </div>
        }
        
        <div class="pricing">
          @if (event().pricing.doubleOccupancy) {
            <span class="price">{{ event().pricing.currency }}{{ event().pricing.doubleOccupancy }} per person (double)</span>
          }
          @if (event().pricing.singleOccupancy) {
            <span class="price">{{ event().pricing.currency }}{{ event().pricing.singleOccupancy }} per person (single)</span>
          }
        </div>
      </mat-card-content>
      
      <mat-card-actions class="card-actions">
        <button mat-button color="primary" [routerLink]="['/event', event().id]">
          <mat-icon>visibility</mat-icon>
          View Details
        </button>
        @if (showEditActions()) {
          <button mat-button (click)="onEdit()">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button [color]="event().status === 'published' ? 'warn' : 'accent'" (click)="onToggleStatus()">
            <mat-icon>{{ event().status === 'published' ? 'visibility_off' : 'publish' }}</mat-icon>
            {{ event().status === 'published' ? 'Unpublish' : 'Publish' }}
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .event-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.3s ease;
      background: rgba(26, 26, 62, 0.8);
      border: 1px solid var(--cosmic-border);
    }

    .event-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      border-color: var(--cosmic-primary);
    }

    .event-card.promoted {
      border: 2px solid var(--cosmic-accent);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
    }

    .promoted-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--cosmic-accent);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 1;
    }

    .promoted-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      position: relative;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .event-card:hover .card-image img {
      transform: scale(1.05);
    }

    .placeholder-image {
      width: 100%;
      height: 100%;
      background: var(--cosmic-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .placeholder-image mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .card-content {
      flex: 1;
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .type-chip {
      background: var(--cosmic-primary);
      color: white;
      font-size: 0.75rem;
    }

    .dates {
      font-size: 0.875rem;
      color: var(--cosmic-text-secondary);
    }

    .event-title {
      font-family: 'Orbitron', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--cosmic-text);
    }

    .event-subtitle {
      font-size: 0.875rem;
      color: var(--cosmic-text-secondary);
      margin-bottom: 1rem;
      font-style: italic;
    }

    .event-description {
      color: var(--cosmic-text-secondary);
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .speakers-preview {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: var(--cosmic-text-secondary);
      font-size: 0.875rem;
    }

    .speakers-preview mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .pricing {
      margin-top: auto;
    }

    .price {
      font-weight: 600;
      color: var(--cosmic-accent);
      font-size: 0.875rem;
    }

    .card-actions {
      padding: 1rem 1.5rem;
      gap: 0.5rem;
      border-top: 1px solid var(--cosmic-border);
    }

    .card-actions button {
      flex: 1;
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      
      .card-actions {
        flex-direction: column;
      }
    }
  `],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class EventCardComponent {
  event = input.required<Event>();
  showEditActions = input<boolean>(false);
  
  edit = output<Event>();
  toggleStatus = output<Event>();

  onEdit(): void {
    this.edit.emit(this.event());
  }

  onToggleStatus(): void {
    this.toggleStatus.emit(this.event());
  }

  getEventTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      'event': 'Guided Event',
      'conference': 'Conference',
      'meeting': 'Meeting',
      'cruise': 'Cruise',
      'tour': 'Tour'
    };
    return typeMap[type] || type;
  }

  formatDateRange(startDate: Date, endDate: Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', options);
    }
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
}