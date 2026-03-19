import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {

  constructor(private router: Router) {}

scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector('.topbar') as HTMLElement;
  const headerHeight = header?.offsetHeight || 0;

  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerHeight - 20;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });

  this.closeMenu();
}


menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
  const menu = document.querySelector('.menu');
  menu?.classList.toggle('active');
}

closeMenu() {
  this.menuOpen = false;
  const menu = document.querySelector('.menu');
  menu?.classList.remove('active');
}
}
