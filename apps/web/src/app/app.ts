import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@cosmic-events/common-ui';

@Component({
  imports: [Footer, Header, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'web';
}
