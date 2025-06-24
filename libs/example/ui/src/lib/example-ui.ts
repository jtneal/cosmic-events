import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-example-ui',
  imports: [CommonModule],
  templateUrl: './example-ui.html',
  styleUrl: './example-ui.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleUi {}
