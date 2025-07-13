import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroContent } from './hero-content/hero-content';
import { HeroMedia } from './hero-media/hero-media';

@Component({
  selector: 'lib-hero',
  imports: [HeroContent, HeroMedia],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
