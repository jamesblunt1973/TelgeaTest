import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Normalizer } from './feature/normalizer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Normalizer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
