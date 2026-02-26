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

  const yOffset = -110; // altura del header
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}

  private scroll(section: string) {
  const element = document.getElementById(section);
  console.log(`Buscando #${section} →`, element);

  if (element) {
    console.log('Haciendo scrollIntoView...');
    
    // Opción A: alineación al inicio (más común)
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'     // lleva la sección justo al tope de la ventana
    });

    // Opción B: si el header tapa, prueba con 'nearest' o ajusta manualmente
    // element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    console.warn(`No encontrado #${section}`);
  }
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
