import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut, Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  constructor(private auth: Auth, private router: Router) {}

  isSidebarOpen = false;
  showLogoutModal = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false;
  }

  // ✅ Abrir modal en vez de cerrar sesión directo
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  // ✅ Cerrar modal sin salir
  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  // ✅ Confirmar logout
  async confirmLogout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.showLogoutModal = false;
      this.isSidebarOpen = false;
    }
  }
}
