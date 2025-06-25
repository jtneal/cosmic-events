import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-home-data-access',
  imports: [CommonModule],
  templateUrl: './home-data-access.html',
  styleUrl: './home-data-access.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeDataAccess {}
