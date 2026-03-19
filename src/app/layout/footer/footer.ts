import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {

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
}

}