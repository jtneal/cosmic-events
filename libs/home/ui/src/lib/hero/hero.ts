import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button, CosmicTitle } from '@cosmic-events/common-ui';
import { Orb } from '../orb/orb';

@Component({
  selector: 'lib-hero',
  imports: [Button, CosmicTitle, Orb, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  scrollToEvents(): void {
    const element = document.querySelector('.search-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
