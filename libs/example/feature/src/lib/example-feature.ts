import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-example-feature',
  imports: [CommonModule],
  templateUrl: './example-feature.html',
  styleUrl: './example-feature.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleFeature {}
