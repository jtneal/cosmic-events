import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar class="cosmic-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            <mat-icon class="brand-icon">explore</mat-icon>
            <span class="brand-text">Cosmic Events</span>
          </a>
        </div>
        
        <nav class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>home</mat-icon>
            Discover
          </a>
          <a mat-button routerLink="/create" routerLinkActive="active">
            <mat-icon>add_circle</mat-icon>
            Create Event
          </a>
          <a mat-button routerLink="/my-events" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            My Events
          </a>
          
          <button mat-button [matMenuTriggerFor]="moreMenu">
            <mat-icon>more_vert</mat-icon>
            More
          </button>
          <mat-menu #moreMenu="matMenu">
            <a mat-menu-item routerLink="/about">
              <mat-icon>info</mat-icon>
              About
            </a>
            <a mat-menu-item routerLink="/contact">
              <mat-icon>contact_mail</mat-icon>
              Contact
            </a>
            <a mat-menu-item href="/help" target="_blank">
              <mat-icon>help</mat-icon>
              Help
            </a>
          </mat-menu>
        </nav>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .nav-brand {
      display: flex;
      align-items: center;
    }

    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--cosmic-text);
      transition: all 0.3s ease;
    }

    .brand-link:hover {
      color: var(--cosmic-primary);
    }

    .brand-icon {
      margin-right: 0.5rem;
      font-size: 2rem;
      background: var(--cosmic-gradient);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-text {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      font-size: 1.5rem;
      background: var(--cosmic-gradient);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--cosmic-text);
      transition: all 0.3s ease;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: var(--cosmic-primary);
      background: rgba(139, 92, 246, 0.1);
    }

    .nav-links button {
      color: var(--cosmic-text);
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 0.5rem;
      }
      
      .brand-text {
        font-size: 1.2rem;
      }
      
      .nav-links {
        gap: 0.5rem;
      }
      
      .nav-links a span {
        display: none;
      }
    }
  `],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class HeaderComponent {}