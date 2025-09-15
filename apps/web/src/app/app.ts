import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '@cosmic-events/data-access';
import { Footer, Header } from '@cosmic-events/ui-components';

@Component({
  imports: [CommonModule, Footer, Header, RouterModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly user = inject(UserService);
  private readonly viewportScroller = inject(ViewportScroller);
  
  public user$ = this.user.getUser();

  public ngOnInit(): void {
    this.viewportScroller.setOffset([0, 24]);
  }
}
