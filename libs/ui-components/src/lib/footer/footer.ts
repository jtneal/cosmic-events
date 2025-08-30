import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'lib-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  public year = new Date().getFullYear();
}
