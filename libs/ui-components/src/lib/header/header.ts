import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MatButtonModule, RouterModule],
  providers: [],
  selector: 'lib-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {}
