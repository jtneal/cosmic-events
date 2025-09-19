import { Component, DOCUMENT, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserDto } from '@cosmic-events/util-dtos';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  selector: 'lib-hero',
  styleUrl: './hero.scss',
  templateUrl: './hero.html',
})
export class Hero {
  private readonly document = inject(DOCUMENT);
  public user = input.required<UserDto | null>();

  public isClosable = input<boolean>(true)
  public heroClosed = output<void>();

  public close(): void {
    this.heroClosed.emit();
  }

  public scroll(): void {
    this.document.getElementById('search-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
