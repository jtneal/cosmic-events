import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  imports: [
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'lib-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  public formatSliderLabel(value: number): string {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }

    return `${value}`;
  }
}
