import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@cosmic-events/ui-common';

@Component({
  imports: [Footer, Header, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
