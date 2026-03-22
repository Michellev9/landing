import { Routes } from '@angular/router';
import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './auth/login/login';
import { Dashboard } from './admin/layout/dashboard/dashboard';
import { Configuracion } from './admin/layout/configuracion/configuracion';
import { GestionUsuarios } from './admin/layout/gestion-usuarios/gestion-usuarios';


export const routes: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      { path: '', component: Inicio },
      { path: 'login', component: Login }
    ]
  },

  {
    path: 'admin',
    component: DashboardLayout,
    children: [

      { path: 'dashboard', component: Dashboard },
      { path: 'gestion-usuarios', component: GestionUsuarios },
      { path: 'configuracion', component: Configuracion },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
