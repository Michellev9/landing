import { Component, signal } from '@angular/core';
import { provideRouter, RouterOutlet, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('starnutri-web');
  
}

provideRouter(routes, withInMemoryScrolling({
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
}))



