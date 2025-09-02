import { Component } from '@angular/core';
import { Hero } from '@cosmic-events/ui-components';

@Component({
  imports: [Hero],
  selector: 'lib-about-feature',
  styleUrl: './about-feature.scss',
  templateUrl: './about-feature.html',
})
export class AboutFeature {}
