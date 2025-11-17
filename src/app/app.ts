import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search } from './components/search/search';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Search, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
}
