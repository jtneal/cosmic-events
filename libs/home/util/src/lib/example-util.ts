import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-home-util',
  imports: [CommonModule],
  templateUrl: './home-util.html',
  styleUrl: './home-util.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUtil {}
