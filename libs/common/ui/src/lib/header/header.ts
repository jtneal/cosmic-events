import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-header',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  links = [
    { icon: 'home', label: 'Discover', link: '/' },
    { icon: 'add_circle', label: 'Create Event', link: '/create' },
    { icon: 'dashboard', label: 'My Events', link: '/my-events' },
    { icon: 'info', label: 'About', link: '/about' },
    { icon: 'contact_mail', label: 'Contact', link: '/contact' },
  ];
}
