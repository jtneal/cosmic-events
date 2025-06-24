import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-common-util',
  imports: [CommonModule],
  templateUrl: './common-util.html',
  styleUrl: './common-util.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonUtil {}
