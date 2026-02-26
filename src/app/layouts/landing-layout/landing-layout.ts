import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';

@Component({
  selector: 'app-landing-layout',
  imports: [CommonModule, Header, Footer, RouterOutlet],
  templateUrl: './landing-layout.html',
  styleUrls: ['./landing-layout.css'] 
})
export class LandingLayout implements OnInit {

  showHeaderAndFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      
      const url = event.urlAfterRedirects;
      
      const isHiddenPage = 
        url === '/login' || 
        url.startsWith('/login') ||
        url === '/registro' || 
        url.startsWith('/auth/');

      this.showHeaderAndFooter = !isHiddenPage;

    });

    const initialUrl = this.router.url;
    this.showHeaderAndFooter = !(
      initialUrl === '/login' || 
      initialUrl.startsWith('/login')
    );
  }
}