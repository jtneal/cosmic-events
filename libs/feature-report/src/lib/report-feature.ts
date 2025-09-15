import { httpResource } from '@angular/common/http';
import { Component, computed, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { EventDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
  ],
  selector: 'lib-report-feature',
  styleUrl: './report-feature.scss',
  templateUrl: './report-feature.html',
})
export class ReportFeature {
  public events = httpResource<EventDto[]>(() => '/api/user/events');

  public dataSource = computed(() => {
    const table = new MatTableDataSource(this.events.value());

    table.sort = this.sort;

    return table;
  });

  public displayedColumns = [
    'title',
    'impressions',
    'clicks',
    'views',
    'organizerUrlClicks',
    'purchaseLinkClicks',
    'websiteClicks',
    'createdAt',
    'updatedAt',
  ];

  @ViewChild(MatSort) public sort!: MatSort;
}
