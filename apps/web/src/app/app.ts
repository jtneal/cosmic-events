import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "@cosmic-events/ui-components";

@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
