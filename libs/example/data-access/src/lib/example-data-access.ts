import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-example-data-access',
  imports: [CommonModule],
  templateUrl: './example-data-access.html',
  styleUrl: './example-data-access.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleDataAccess {}
