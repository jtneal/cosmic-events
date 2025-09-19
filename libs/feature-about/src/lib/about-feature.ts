import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '@cosmic-events/data-access';
import { Hero } from '@cosmic-events/ui-components';

@Component({
  imports: [AsyncPipe, Hero],
  selector: 'lib-about-feature',
  styleUrl: './about-feature.scss',
  templateUrl: './about-feature.html',
})
export class AboutFeature {
  private readonly user = inject(UserService);
  
  public user$ = this.user.getUser();
}
