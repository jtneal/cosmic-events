import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { TourService } from '../../services/tour.service';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { Tour, TourSearchFilters, TourType } from '../../models/tour.model';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="cosmic-title">Cosmic Tours</h1>
          <p class="hero-subtitle">
            Discover Ancient Mysteries, UFO Expeditions & Extraordinary Adventures
          </p>
          <p class="hero-description">
            Join fellow explorers on journeys to uncover lost civilizations, investigate paranormal phenomena, 
            and attend conferences that challenge conventional wisdom. From Atlantis expeditions to UFO hotspots, 
            your next cosmic adventure awaits.
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" class="cosmic-btn cosmic-btn-primary" (click)="scrollToTours()">
              <mat-icon>explore</mat-icon>
              Explore Tours
            </button>
            <button mat-raised-button class="cosmic-btn cosmic-btn-secondary" routerLink="/create">
              <mat-icon>add</mat-icon>
              List Your Tour
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="cosmic-orb"></div>
          <div class="orbit-ring"></div>
          <div class="stars"></div>
        </div>
      </section>

      <!-- Search & Filters -->
      <section class="search-section" #toursSection>
        <div class="search-container">
          <h2>Find Your Perfect Adventure</h2>
          <div class="search-form">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search tours, locations, topics...</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Atlantis, UFO sightings, Ancient Egypt...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Tour Type</mat-label>
              <mat-select [(ngModel)]="selectedType">
                <mat-option value="">All Types</mat-option>
                @for (type of tourTypes; track type.value) {
                  <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="searchTours()">
              <mat-icon>search</mat-icon>
              Search
            </button>
          </div>
        </div>
      </section>

      <!-- Promoted Tours -->
      @if (promotedTours().length > 0) {
        <section class="promoted-section">
          <div class="section-header">
            <h2>
              <mat-icon>star</mat-icon>
              Featured & Promoted Tours
            </h2>
            <p>Discover highlighted adventures from our community</p>
          </div>
          <div class="tours-grid promoted-grid">
            @for (tour of promotedTours(); track tour.id) {
              <app-tour-card [tour]="tour" />
            }
          </div>
        </section>
      }

      <!-- All Tours -->
      <section class="tours-section">
        <div class="section-header">
          <h2>
            <mat-icon>explore</mat-icon>
            All Adventures
          </h2>
          <p>{{ totalTours() }} cosmic adventures await</p>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <div class="cosmic-loader">
              <div class="planet"></div>
              <div class="orbit"></div>
            </div>
            <p>Loading cosmic adventures...</p>
          </div>
        } @else if (tours().length === 0) {
          <div class="empty-state">
            <mat-icon>explore_off</mat-icon>
            <h3>No tours found</h3>
            <p>Try adjusting your search criteria or be the first to create a tour!</p>
            <button mat-raised-button color="primary" routerLink="/create">
              <mat-icon>add</mat-icon>
              Create First Tour
            </button>
          </div>
        } @else {
          <div class="tours-grid">
            @for (tour of tours(); track tour.id) {
              <app-tour-card [tour]="tour" />
            }
          </div>
          
          @if (hasMoreTours()) {
            <div class="load-more">
              <button mat-raised-button color="primary" (click)="loadMoreTours()" [disabled]="loading()">
                <mat-icon>expand_more</mat-icon>
                Load More Tours
              </button>
            </div>
          }
        }
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
            <p>Ghost tours, cryptozoology, and supernatural experiences</p>
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
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      min-height: 80vh;
      padding: 4rem 0;
    }

    .hero-content h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: var(--cosmic-secondary);
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--cosmic-text-secondary);
      margin-bottom: 2rem;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-visual {
      position: relative;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cosmic-orb {
      width: 200px;
      height: 200px;
      background: var(--cosmic-gradient);
      border-radius: 50%;
      position: relative;
      animation: pulse 3s ease-in-out infinite;
      box-shadow: 0 0 50px rgba(139, 92, 246, 0.5);
    }

    .orbit-ring {
      position: absolute;
      width: 300px;
      height: 300px;
      border: 2px solid var(--cosmic-secondary);
      border-radius: 50%;
      border-top: 2px solid transparent;
      animation: orbit 8s linear infinite;
    }

    .stars {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(139, 92, 246, 0.8), transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent);
      background-repeat: repeat;
      background-size: 100px 100px;
      animation: twinkle 4s ease-in-out infinite alternate;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes orbit {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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

    .tours-section {
      margin: 4rem 0;
    }

    .tours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .loading-state, .empty-state {
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
      .hero-section {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
        padding: 2rem 0;
      }

      .hero-content h1 {
        font-size: 2.5rem;
      }

      .hero-visual {
        height: 300px;
      }

      .cosmic-orb {
        width: 150px;
        height: 150px;
      }

      .orbit-ring {
        width: 200px;
        height: 200px;
      }

      .search-form {
        flex-direction: column;
      }

      .tours-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    TourCardComponent
  ]
})
export class HomeComponent implements OnInit {
  private tourService = inject(TourService);

  // Signals for reactive state management
  tours = signal<Tour[]>([]);
  promotedTours = signal<Tour[]>([]);
  loading = signal(false);
  totalTours = signal(0);
  currentPage = signal(1);
  hasMoreTours = computed(() => this.tours().length < this.totalTours());

  // Search and filter state
  searchTerm = '';
  selectedType: TourType | '' = '';
  tourTypes = this.tourService.getTourTypes();

  constructor() {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loading.set(true);
    
    // Load promoted tours
    this.tourService.getPromotedTours().subscribe({
      next: (promoted) => this.promotedTours.set(promoted),
      error: (error) => console.error('Error loading promoted tours:', error)
    });

    // Load regular tours
    this.tourService.getTours({}, 1, 12).subscribe({
      next: (response) => {
        this.tours.set(response.tours);
        this.totalTours.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tours:', error);
        this.loading.set(false);
      }
    });
  }

  searchTours(): void {
    this.loading.set(true);
    this.currentPage.set(1);

    const filters: TourSearchFilters = {};
    if (this.searchTerm.trim()) {
      filters.searchTerm = this.searchTerm.trim();
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }

    this.tourService.getTours(filters, 1, 12).subscribe({
      next: (response) => {
        this.tours.set(response.tours);
        this.totalTours.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching tours:', error);
        this.loading.set(false);
      }
    });
  }

  loadMoreTours(): void {
    if (this.loading() || !this.hasMoreTours()) return;

    this.loading.set(true);
    const nextPage = this.currentPage() + 1;

    const filters: TourSearchFilters = {};
    if (this.searchTerm.trim()) {
      filters.searchTerm = this.searchTerm.trim();
    }
    if (this.selectedType) {
      filters.type = this.selectedType;
    }

    this.tourService.getTours(filters, nextPage, 12).subscribe({
      next: (response) => {
        this.tours.update(current => [...current, ...response.tours]);
        this.currentPage.set(nextPage);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading more tours:', error);
        this.loading.set(false);
      }
    });
  }

  filterByCategory(category: string): void {
    this.searchTerm = category;
    this.searchTours();
    this.scrollToTours();
  }

  scrollToTours(): void {
    const element = document.querySelector('.search-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}