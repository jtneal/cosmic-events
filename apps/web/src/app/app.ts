import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '@cosmic-events/data-access';
import { Footer, Header } from '@cosmic-events/ui-components';

@Component({
  imports: [CommonModule, Footer, Header, RouterModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly user = inject(UserService);
  
  public user$ = this.user.getUser();
}
