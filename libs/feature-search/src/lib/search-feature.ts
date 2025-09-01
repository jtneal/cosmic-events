import { Component } from '@angular/core';
import { Hero, Search } from '@cosmic-events/ui-components';

@Component({
  imports: [Hero, Search],
  selector: 'lib-search-feature',
  styleUrl: './search-feature.scss',
  templateUrl: './search-feature.html',
})
export class SearchFeature {
  public isHeroHidden = localStorage.getItem('isHeroHidden') === 'true';

  public hideHero(): void {
    this.isHeroHidden = true;
    localStorage.setItem('isHeroHidden', 'true');
  }
}
