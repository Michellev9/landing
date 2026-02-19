import { Routes } from '@angular/router';

/* Layouts */
import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

/* Landing Pages */
import { Inicio } from './pages/inicio/inicio';
import { Nosotros } from './pages/nosotros/nosotros';
import { Caracteristicas } from './pages/caracteristicas/caracteristicas';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './auth/login/login';

/* Dashboard Pages */
import { Dashboard } from './admin/layout/dashboard/dashboard';
import { GestionNinos } from './admin/layout/gestion-ninos/gestion-ninos';
import { GestionPadres } from './admin/layout/gestion-padres/gestion-padres';
import { Configuracion } from './admin/layout/configuracion/configuracion';


export const routes: Routes = [
  /* Landing Pages */
  {
    path: '',
    component: LandingLayout,
    children: [
      { path: '', component: Inicio },
      { path: 'nosotros', component: Nosotros },
      { path: 'caracteristicas', component: Caracteristicas },
      { path: 'contacto', component: Contacto },
      { path: 'login', component: Login }
    ]
  },

  /* Dashboard Pages */
  {
    path: 'admin',
    component: DashboardLayout,
    children: [
      /* General */
      { path: 'dashboard', component: Dashboard },

      /* Gestión */
      { path: 'gestion-ninos', component: GestionNinos },
      { path: 'gestion-padres', component: GestionPadres },
      { path: 'configuracion', component: Configuracion },

      /* Redirección por defecto */
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  /* Ruta no encontrada */
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
