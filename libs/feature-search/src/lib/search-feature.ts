import { Component } from '@angular/core';
import { Hero, Search } from '@cosmic-events/ui-components';

@Component({
  imports: [Hero, Search],
  selector: 'lib-search-feature',
  styleUrl: './search-feature.scss',
  templateUrl: './search-feature.html',
})
export class SearchFeature {
  public isHeroHidden = false;

  public hideHero(): void {
    this.isHeroHidden = true;
    // Save cookie so it doesn't keep showing
  }
}
