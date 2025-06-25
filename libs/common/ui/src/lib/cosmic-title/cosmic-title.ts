import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-cosmic-title',
  templateUrl: './cosmic-title.html',
  styleUrl: './cosmic-title.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosmicTitle {
  type = input<'primary' | 'secondary'>('primary');
}
