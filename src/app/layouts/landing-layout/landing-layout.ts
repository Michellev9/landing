import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-landing-layout',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
})
export class LandingLayout {

}
