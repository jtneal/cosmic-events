import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button, CosmicTitle } from '@cosmic-events/ui-common';

@Component({
  selector: 'lib-hero-content',
  imports: [Button, CosmicTitle, RouterModule],
  templateUrl: './hero-content.html',
  styleUrl: './hero-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroContent {
  private document = inject(DOCUMENT);

  scrollToSection(sectionId: string): void {
    const element = this.document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
