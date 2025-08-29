import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [MatChipsModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  selector: 'lib-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {}
