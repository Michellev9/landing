import { Component, HostListener, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  name: string = '';
  regEmail: string = '';
  regPassword: string = '';
  confirmPassword: string = '';

  isLoading: boolean = false;
  isRegisterMode: boolean = false;

  mouseX = 0;
  mouseY = 0;

  private targetScrollY = 0;
  private currentScrollY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private animationFrameId: number | any = 0;

    floatingItems = [
    { icon: '⭐', baseTop: 52, currentTop: 52, left: 15, size: '2.2rem', delay: '0s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.05 },
    { icon: '🍎', baseTop: 25, currentTop: 25, left: 80, size: '3rem', delay: '1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.12 },
    { icon: '🍌', baseTop: 65, currentTop: 65, left: 10, size: '3.5rem', delay: '2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.15 },
    { icon: '🥕', baseTop: 75, currentTop: 75, left: 85, size: '3.2rem', delay: '0.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.08 },
    { icon: '⭐', baseTop: 80, currentTop: 80, left: 45, size: '1.8rem', delay: '1.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.06 },
    { icon: '🥦', baseTop: 35, currentTop: 35, left: 40, size: '2.5rem', delay: '2.5s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.11 },
    { icon: '🍊', baseTop: 45, currentTop: 45, left: 8, size: '2.8rem', delay: '0.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.13 },
    { icon: '⭐', baseTop: 90, currentTop: 90, left: 75, size: '2rem', delay: '1.2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.07 },
    { icon: '🍇', baseTop: 15, currentTop: 15, left: 55, size: '2.6rem', delay: '0.3s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.14 },
    { icon: '🍓', baseTop: 20, currentTop: 20, left: 20, size: '2.4rem', delay: '1.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.1 },
    { icon: '🍒', baseTop: 50, currentTop: 50, left: 92, size: '2.1rem', delay: '2.2s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.09 },
    { icon: '🍍', baseTop: 5, currentTop: 5, left: 65, size: '3.8rem', delay: '1.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.16 },
    { icon: '🥝', baseTop: 55, currentTop: 55, left: 30, size: '2.3rem', delay: '0.7s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.12 },
    { icon: '🍐', baseTop: 88, currentTop: 88, left: 15, size: '2.7rem', delay: '1.4s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.11 },
    { icon: '🥑', baseTop: 38, currentTop: 38, left: 68, size: '2.9rem', delay: '2.8s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.13 },
    { icon: '🍉', baseTop: 95, currentTop: 95, left: 42, size: '4rem', delay: '2.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.18 },
    { icon: '🍋', baseTop: 8, currentTop: 8, left: 42, size: '2.2rem', delay: '0.1s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.09 },
    { icon: '⭐', baseTop: 12, currentTop: 12, left: 15, size: '2.2rem', delay: '0s', interactive: true, transformX: 0, transformY: 0, parallaxSpeed: 0.05 },
    
  ];

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, private router: Router) {}


  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY;
      this.currentScrollY = this.targetScrollY;
      this.targetMouseX = window.innerWidth / 2;
      this.targetMouseY = window.innerHeight / 2;

      this.ngZone.runOutsideAngular(() => {
        this.animationLoop();
      });
    }
  }

  ngOnDestroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }

    toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  login() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/admin/dashboard']);
    }, 1500);
  }

  register() {
    if (this.regPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.toggleMode(); // vuelve a log|in después de registrar
      // Aquí iría tu lógica real de registro + auth
    }, 1800);
  }

  

  @HostListener('window:scroll')
  onScroll() {
    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.targetMouseX = e.clientX;
    this.targetMouseY = e.clientY;
  }

  animationLoop() {
    let needsUpdate = false;

    // Smooth Scroll Y LERP
    if (Math.abs(this.targetScrollY - this.currentScrollY) > 0.1) {
      this.currentScrollY += (this.targetScrollY - this.currentScrollY) * 0.08;
      needsUpdate = true;
    } else {
      this.currentScrollY = this.targetScrollY;
    }

    // Smooth Background Movement LERP
    const targetBgMouseX = this.targetMouseX - window.innerWidth / 2;
    const targetBgMouseY = this.targetMouseY - window.innerHeight / 2;

    if (Math.abs(targetBgMouseX - this.mouseX) > 0.1) {
      this.mouseX += (targetBgMouseX - this.mouseX) * 0.1;
      needsUpdate = true;
    }
    if (Math.abs(targetBgMouseY - this.mouseY) > 0.1) {
      this.mouseY += (targetBgMouseY - this.mouseY) * 0.1;
      needsUpdate = true;
    }

    // Floating Items Parallax & Repel LERP
    const repelRadius = 180;
    this.floatingItems.forEach(item => {
      // 1. Scroll Parallax
      let newTop = item.baseTop - (this.currentScrollY * item.parallaxSpeed);
      const range = 140; // -20 to 120
      let offset = (newTop + 20) % range;
      if (offset < 0) offset += range;

      const nextTop = offset - 20;
      if (Math.abs(item.currentTop - nextTop) > 0.01) {
        item.currentTop = nextTop;
        needsUpdate = true;
      }

      // 2. Mouse Repel
      if (!item.interactive) return;

      const itemX = (window.innerWidth * item.left) / 100;
      const itemY = (window.innerHeight * item.currentTop) / 100;

      const dx = itemX - this.targetMouseX;
      const dy = itemY - this.targetMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let targetTransformX = 0;
      let targetTransformY = 0;

      if (distance < repelRadius) {
        const force = (repelRadius - distance) / repelRadius;
        targetTransformX = (dx / distance) * force * 60;
        targetTransformY = (dy / distance) * force * 60;
      }

      if (Math.abs(targetTransformX - item.transformX) > 0.1 || Math.abs(targetTransformY - item.transformY) > 0.1) {
        item.transformX += (targetTransformX - item.transformX) * 0.15;
        item.transformY += (targetTransformY - item.transformY) * 0.15;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      this.cdr.detectChanges();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
  }

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

}