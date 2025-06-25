import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-orb',
  templateUrl: './orb.html',
  styleUrl: './orb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orb {}
