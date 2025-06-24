import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-example-util',
  imports: [CommonModule],
  templateUrl: './example-util.html',
  styleUrl: './example-util.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleUtil {}
