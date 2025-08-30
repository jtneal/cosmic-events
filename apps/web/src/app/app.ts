import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@cosmic-events/ui-components';

@Component({
  imports: [Footer, Header, RouterModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
