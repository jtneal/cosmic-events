import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule, MatIconModule, RouterModule],
  selector: 'lib-confirm-delete',
  styleUrl: './confirm-delete.scss',
  templateUrl: './confirm-delete.html',
})
export class ConfirmDelete {}
