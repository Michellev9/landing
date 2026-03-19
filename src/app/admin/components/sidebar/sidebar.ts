import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
 constructor(private auth: Auth, private router: Router) { }

 isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 
  navigateTo(route: string) {
  this.router.navigate([route]);
  this.isSidebarOpen = false; 
}

async logout() {
  await signOut(this.auth);
  this.router.navigate(['/login']);
  this.isSidebarOpen = false;
}
}
