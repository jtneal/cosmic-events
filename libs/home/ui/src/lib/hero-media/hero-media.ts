import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-hero-media',
  templateUrl: './hero-media.html',
  styleUrl: './hero-media.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroMedia {}
