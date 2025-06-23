import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model';

@Component({
  selector: 'app-tour-detail',
  template: `
    <div class="tour-detail-container">
      @if (loading()) {
        <div class="loading-state">
          <div class="cosmic-loader">
            <div class="planet"></div>
            <div class="orbit"></div>
          </div>
          <p>Loading tour details...</p>
        </div>
      } @else if (tour()) {
        <div class="tour-content">
          <!-- Hero Section -->
          <section class="hero-section">
            <div class="hero-image">
              @if (tour()!.featuredImage) {
                <img [src]="tour()!.featuredImage" [alt]="tour()!.title" />
              } @else {
                <div class="placeholder-image">
                  <mat-icon>explore</mat-icon>
                </div>
              }
              @if (tour()!.isPromoted) {
                <div class="promoted-badge">
                  <mat-icon>star</mat-icon>
                  <span>Promoted</span>
                </div>
              }
            </div>
            
            <div class="hero-content">
              <div class="tour-meta">
                <mat-chip-set>
                  <mat-chip class="type-chip">{{ getTourTypeLabel(tour()!.type) }}</mat-chip>
                  <mat-chip class="date-chip">{{ formatDateRange(tour()!.startDate, tour()!.endDate) }}</mat-chip>
                </mat-chip-set>
              </div>
              
              <h1 class="tour-title">{{ tour()!.title }}</h1>
              @if (tour()!.subtitle) {
                <p class="tour-subtitle">{{ tour()!.subtitle }}</p>
              }
              
              <div class="pricing-info">
                @if (tour()!.pricing.doubleOccupancy) {
                  <div class="price-item">
                    <span class="price">{{ tour()!.pricing.currency }}{{ tour()!.pricing.doubleOccupancy }}</span>
                    <span class="price-label">per person (double occupancy)</span>
                  </div>
                }
                @if (tour()!.pricing.singleOccupancy) {
                  <div class="price-item">
                    <span class="price">{{ tour()!.pricing.currency }}{{ tour()!.pricing.singleOccupancy }}</span>
                    <span class="price-label">per person (single occupancy)</span>
                  </div>
                }
              </div>
              
              <div class="action-buttons">
                @if (tour()!.contactInfo.website) {
                  <button mat-raised-button color="primary" class="contact-btn" 
                    (click)="openLink(tour()!.contactInfo.website!)">
                    <mat-icon>launch</mat-icon>
                    Visit Website & Book
                  </button>
                }
                @if (tour()!.contactInfo.email) {
                  <button mat-raised-button color="accent" class="contact-btn"
                    (click)="sendEmail(tour()!.contactInfo.email!)">
                    <mat-icon>email</mat-icon>
                    Send Email
                  </button>
                }
                @if (tour()!.contactInfo.phone) {
                  <button mat-button class="contact-btn"
                    (click)="callPhone(tour()!.contactInfo.phone!)">
                    <mat-icon>phone</mat-icon>
                    {{ tour()!.contactInfo.phone }}
                  </button>
                }
              </div>
            </div>
          </section>

          <!-- Main Content Tabs -->
          <section class="content-section">
            <div class="content-tabs">
              <button class="tab-button" 
                [class.active]="activeTab() === 'overview'" 
                (click)="setActiveTab('overview')">
                <mat-icon>info</mat-icon>
                Overview
              </button>
              
              @if (tour()!.itinerary.length > 0) {
                <button class="tab-button" 
                  [class.active]="activeTab() === 'itinerary'" 
                  (click)="setActiveTab('itinerary')">
                  <mat-icon>event_note</mat-icon>
                  Itinerary
                </button>
              }
              
              @if (tour()!.speakers.length > 0) {
                <button class="tab-button" 
                  [class.active]="activeTab() === 'speakers'" 
                  (click)="setActiveTab('speakers')">
                  <mat-icon>people</mat-icon>
                  Speakers
                </button>
              }
              
              @if (tour()!.moreInfo.length > 0) {
                <button class="tab-button" 
                  [class.active]="activeTab() === 'info'" 
                  (click)="setActiveTab('info')">
                  <mat-icon>help</mat-icon>
                  More Info
                </button>
              }
            </div>

            <div class="tab-content">
              <!-- Overview Tab -->
              @if (activeTab() === 'overview') {
                <div class="overview-content">
                  <div class="description-section">
                    <h2>About This Adventure</h2>
                    <div class="description" [innerHTML]="tour()!.description"></div>
                  </div>

                  @if (tour()!.videoLink) {
                    <div class="video-section">
                      <h3>Watch the Trailer</h3>
                      <div class="video-container">
                        <iframe [src]="getVideoEmbedUrl(tour()!.videoLink!)" 
                          frameborder="0" allowfullscreen></iframe>
                      </div>
                    </div>
                  }

                  @if (tour()!.additionalLegs.length > 0) {
                    <div class="additional-legs">
                      <h3>Additional Tour Options</h3>
                      <div class="legs-grid">
                        @for (leg of sortedAdditionalLegs(); track leg.id) {
                          <mat-card class="leg-card">
                            <mat-card-header>
                              <mat-card-title>{{ leg.title }}</mat-card-title>
                              @if (leg.additionalCost) {
                                <mat-card-subtitle>
                                  Additional: {{ tour()!.pricing.currency }}{{ leg.additionalCost }}
                                </mat-card-subtitle>
                              }
                            </mat-card-header>
                            
                            @if (leg.image) {
                              <img mat-card-image [src]="leg.image" [alt]="leg.title" />
                            }
                            
                            <mat-card-content>
                              <div [innerHTML]="leg.description"></div>
                            </mat-card-content>
                          </mat-card>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Itinerary Tab -->
              @if (activeTab() === 'itinerary') {
                <div class="itinerary-content">
                  <h2>Daily Itinerary</h2>
                  <mat-accordion>
                    @for (day of sortedItinerary(); track day.id; let i = $index) {
                      <mat-expansion-panel>
                        <mat-expansion-panel-header>
                          <mat-panel-title>
                            Day {{ i + 1 }}: {{ day.title }}
                          </mat-panel-title>
                        </mat-expansion-panel-header>
                        
                        <div class="itinerary-day">
                          @if (day.image) {
                            <img [src]="day.image" [alt]="day.title" class="day-image" />
                          }
                          <div class="day-description" [innerHTML]="day.description"></div>
                        </div>
                      </mat-expansion-panel>
                    }
                  </mat-accordion>
                </div>
              }

              <!-- Speakers Tab -->
              @if (activeTab() === 'speakers') {
                <div class="speakers-content">
                  <h2>Meet Your Guides & Experts</h2>
                  <div class="speakers-grid">
                    @for (speaker of tour()!.speakers; track speaker.id) {
                      <mat-card class="speaker-card">
                        @if (speaker.image) {
                          <div class="speaker-image">
                            <img [src]="speaker.image" [alt]="speaker.name" />
                          </div>
                        }
                        
                        <mat-card-content>
                          <h3 class="speaker-name">{{ speaker.name }}</h3>
                          <div class="speaker-bio" [innerHTML]="speaker.biography"></div>
                          
                          @if (speaker.link) {
                            <button mat-button color="primary" (click)="openLink(speaker.link)">
                              <mat-icon>launch</mat-icon>
                              Learn More
                            </button>
                          }
                        </mat-card-content>
                      </mat-card>
                    }
                  </div>
                </div>
              }

              <!-- More Info Tab -->
              @if (activeTab() === 'info') {
                <div class="more-info-content">
                  <h2>Additional Information</h2>
                  <mat-accordion>
                    @for (info of sortedMoreInfo(); track info.id) {
                      <mat-expansion-panel>
                        <mat-expansion-panel-header>
                          <mat-panel-title>{{ info.title }}</mat-panel-title>
                        </mat-expansion-panel-header>
                        
                        <div class="info-description" [innerHTML]="info.description"></div>
                      </mat-expansion-panel>
                    }
                  </mat-accordion>
                </div>
              }
            </div>
          </section>

          <!-- Contact Section -->
          <section class="contact-section">
            <mat-card class="contact-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>contact_mail</mat-icon>
                  Contact {{ tour()!.contactInfo.name }}
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <p>Ready to embark on this cosmic adventure? Get in touch to learn more or make a reservation.</p>
                
                <div class="contact-methods">
                  @if (tour()!.contactInfo.email) {
                    <button mat-raised-button color="primary" (click)="sendEmail(tour()!.contactInfo.email!)">
                      <mat-icon>email</mat-icon>
                      {{ tour()!.contactInfo.email }}
                    </button>
                  }
                  
                  @if (tour()!.contactInfo.phone) {
                    <button mat-raised-button color="accent" (click)="callPhone(tour()!.contactInfo.phone!)">
                      <mat-icon>phone</mat-icon>
                      {{ tour()!.contactInfo.phone }}
                    </button>
                  }
                  
                  @if (tour()!.contactInfo.website) {
                    <button mat-raised-button (click)="openLink(tour()!.contactInfo.website!)">
                      <mat-icon>launch</mat-icon>
                      Visit Website
                    </button>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </section>
        </div>
      } @else {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <h2>Tour Not Found</h2>
          <p>The tour you're looking for doesn't exist or has been removed.</p>
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon>home</mat-icon>
            Back to Tours
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .tour-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }

    .error-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: var(--cosmic-error);
      margin-bottom: 1rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
      align-items: start;
    }

    .hero-image {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 4/3;
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
    }

    .promoted-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--cosmic-accent);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
    }

    .hero-content {
      padding: 1rem 0;
    }

    .tour-meta {
      margin-bottom: 1rem;
    }

    .type-chip {
      background: var(--cosmic-primary);
      color: white;
    }

    .date-chip {
      background: var(--cosmic-secondary);
      color: white;
    }

    .tour-title {
      font-family: 'Orbitron', monospace;
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      background: var(--cosmic-gradient);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tour-subtitle {
      font-size: 1.2rem;
      color: var(--cosmic-text-secondary);
      margin-bottom: 2rem;
      font-style: italic;
    }

    .pricing-info {
      margin-bottom: 2rem;
    }

    .price-item {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--cosmic-accent);
    }

    .price-label {
      color: var(--cosmic-text-secondary);
      font-size: 0.875rem;
    }

    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .contact-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .content-section {
      margin-bottom: 4rem;
    }

    .content-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--cosmic-border);
      overflow-x: auto;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background: transparent;
      border: none;
      color: var(--cosmic-text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
      font-family: 'Space Grotesk', sans-serif;
    }

    .tab-button:hover {
      color: var(--cosmic-primary);
      background: rgba(139, 92, 246, 0.1);
    }

    .tab-button.active {
      color: var(--cosmic-primary);
      border-bottom-color: var(--cosmic-primary);
    }

    .tab-content {
      min-height: 400px;
    }

    .overview-content h2,
    .itinerary-content h2,
    .speakers-content h2,
    .more-info-content h2 {
      font-family: 'Orbitron', monospace;
      margin-bottom: 2rem;
      color: var(--cosmic-text);
    }

    .description-section {
      margin-bottom: 3rem;
    }

    .description {
      line-height: 1.8;
      color: var(--cosmic-text-secondary);
    }

    .video-section {
      margin-bottom: 3rem;
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      border-radius: 12px;
      overflow: hidden;
    }

    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .additional-legs {
      margin-bottom: 3rem;
    }

    .legs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .leg-card {
      background: rgba(45, 45, 95, 0.5);
      border: 1px solid var(--cosmic-border);
    }

    .itinerary-day {
      padding: 1rem 0;
    }

    .day-image {
      width: 100%;
      max-width: 400px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .day-description {
      line-height: 1.6;
      color: var(--cosmic-text-secondary);
    }

    .speakers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .speaker-card {
      background: rgba(45, 45, 95, 0.5);
      border: 1px solid var(--cosmic-border);
    }

    .speaker-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
    }

    .speaker-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .speaker-name {
      font-family: 'Orbitron', monospace;
      color: var(--cosmic-text);
      margin-bottom: 1rem;
    }

    .speaker-bio {
      line-height: 1.6;
      color: var(--cosmic-text-secondary);
      margin-bottom: 1rem;
    }

    .info-description {
      padding: 1rem 0;
      line-height: 1.6;
      color: var(--cosmic-text-secondary);
    }

    .contact-section {
      margin-bottom: 2rem;
    }

    .contact-card {
      background: rgba(26, 26, 62, 0.8);
      border: 1px solid var(--cosmic-border);
    }

    .contact-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--cosmic-text);
    }

    .contact-methods {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
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

    @media (max-width: 768px) {
      .hero-section {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .tour-title {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .content-tabs {
        justify-content: flex-start;
      }

      .tab-button {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }

      .legs-grid,
      .speakers-grid {
        grid-template-columns: 1fr;
      }

      .contact-methods {
        flex-direction: column;
      }
    }

    /* Material Design Overrides */
    ::ng-deep .mat-expansion-panel {
      background: rgba(45, 45, 95, 0.5);
      color: var(--cosmic-text);
      border: 1px solid var(--cosmic-border);
      margin-bottom: 0.5rem;
    }

    ::ng-deep .mat-expansion-panel-header {
      color: var(--cosmic-text);
    }

    ::ng-deep .mat-expansion-panel-header:hover {
      background: rgba(139, 92, 246, 0.1);
    }
  `],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule
  ]
})
export class TourDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);

  tour = signal<Tour | null>(null);
  loading = signal(true);
  activeTab = signal<'overview' | 'itinerary' | 'speakers' | 'info'>('overview');

  // Computed properties for sorted arrays
  sortedItinerary = computed(() => {
    const tour = this.tour();
    return tour ? [...tour.itinerary].sort((a, b) => a.order - b.order) : [];
  });

  sortedAdditionalLegs = computed(() => {
    const tour = this.tour();
    return tour ? [...tour.additionalLegs].sort((a, b) => a.order - b.order) : [];
  });

  sortedMoreInfo = computed(() => {
    const tour = this.tour();
    return tour ? [...tour.moreInfo].sort((a, b) => a.order - b.order) : [];
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tourId = params['id'];
      if (tourId) {
        this.loadTour(tourId);
      }
    });
  }

  private loadTour(id: string): void {
    this.loading.set(true);
    
    this.tourService.getTour(id).subscribe({
      next: (tour) => {
        this.tour.set(tour);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tour:', error);
        this.tour.set(null);
        this.loading.set(false);
      }
    });
  }

  setActiveTab(tab: 'overview' | 'itinerary' | 'speakers' | 'info'): void {
    this.activeTab.set(tab);
  }

  getTourTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      'tour': 'Guided Tour',
      'conference': 'Conference',
      'meeting': 'Meeting',
      'cruise': 'Cruise',
      'event': 'Event'
    };
    return typeMap[type] || type;
  }

  formatDateRange(startDate: Date, endDate: Date): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    };
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', options);
    }
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }

  getVideoEmbedUrl(url: string): string {
    // Convert YouTube and Vimeo URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Return as-is if not recognized
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  sendEmail(email: string): void {
    const tour = this.tour();
    const subject = encodeURIComponent(`Inquiry about ${tour?.title}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in learning more about the "${tour?.title}" tour.\n\nPlease send me more information.\n\nThank you!`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  }

  callPhone(phone: string): void {
    window.open(`tel:${phone}`);
  }
}