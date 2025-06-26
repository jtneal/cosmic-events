import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CosmicTitle } from '@cosmic-events/common-ui';

@Component({
  selector: 'lib-hero-content',
  imports: [CosmicTitle],
  templateUrl: './hero-content.html',
  styleUrl: './hero-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroContent {}
