import { Component } from '@angular/core';
import { Sidebar } from "../components/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from '../components/admin-header/admin-header';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet, AdminHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
