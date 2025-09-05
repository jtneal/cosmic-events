import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EventCard } from '@cosmic-events/ui-components';
import { EventDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [
    EventCard,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  selector: 'lib-manage-feature',
  styleUrl: './manage-feature.scss',
  templateUrl: './manage-feature.html',
})
export class ManageFeature {
  public events = httpResource<EventDto[]>(() => '/api/user/events');
  public isChecked = false;
}
