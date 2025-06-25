import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-home-feature',
  imports: [CommonModule],
  templateUrl: './home-feature.html',
  styleUrl: './home-feature.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFeature {}
