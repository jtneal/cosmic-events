import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatIconModule, RouterModule],
  selector: 'lib-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  public year = new Date().getFullYear();
}
