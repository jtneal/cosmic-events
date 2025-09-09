import { Pipe, PipeTransform } from '@angular/core';
import slug from 'slug';

@Pipe({
  name: 'slugify',
})
export class SlugifyPipe implements PipeTransform {
  public transform(value: string): string {
    return slug(value);
  }
}
