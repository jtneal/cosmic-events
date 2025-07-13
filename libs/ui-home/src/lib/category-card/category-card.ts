import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-category-card',
  imports: [MatIcon],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCard {
  description = input<string>('');
  icon = input.required<string>();
  selected = true;
  subtitle = input<string>('');
  title = input.required<string>();
}
