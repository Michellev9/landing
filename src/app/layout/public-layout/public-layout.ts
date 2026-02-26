import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayout {


constructor(public router: Router) {
 
}

}