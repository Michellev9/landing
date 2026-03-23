import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';


interface Usuario {
  id: string;
  email: string;
  rol: string;
  modulo: string;
  fecha: any;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  listaUsuarios: Usuario[] = [];

  totalUsuarios = 0;
  totalAdmins = 0;
  totalLanding = 0;
  registrosHoy = 0;
  ultimosUsuarios: Usuario[] = [];
  vistasChart: any;
  rolesChart: any;
  ultimosMensajes: any[] = [];

  constructor(private firestore: Firestore, private router: Router) {}

  async ngOnInit() {
    await this.obtenerUsuariosDashboard();
    this.cargarUltimosMensajes();
  }

  ngAfterViewInit() {
  this.crearGraficaVistas();
}

async obtenerUsuariosDashboard() {

  const snapshot = await getDocs(collection(this.firestore, 'usuariosWeb'));

  const usuarios: any[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as any)
  }));

  this.totalUsuarios = usuarios.length;

  this.totalAdmins = usuarios.filter(u => u.rol === 'admin').length;

  this.totalLanding = usuarios.filter(u => u.modulo === 'landing').length;

  const hoy = new Date().toDateString();

  this.registrosHoy = usuarios.filter(u =>
    u.fecha?.toDate().toDateString() === hoy
  ).length;

  this.ultimosUsuarios = usuarios
    .sort((a, b) => b.fecha?.seconds - a.fecha?.seconds)
    .slice(0, 5);

  setTimeout(() => {
    this.crearGraficaRoles();
  }, 100);
}

crearGraficaVistas() {

  const ctx = document.getElementById('vistasChart') as any;

  const isDark = document.body.classList.contains('dark');

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  this.vistasChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Vistas',
          data: [120, 190, 140, 220, 180, 260, 210],
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor   // 🔥 TEXTO
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    }
  });

}

crearGraficaRoles() {

  const isDark = document.body.classList.contains('dark');

  const textColor = isDark ? '#e2e8f0' : '#1e293b';

  this.rolesChart = new Chart('rolesChart', {
    type: 'bar',
    data: {
      labels: ['Admins', 'Usuarios'],
      datasets: [{
        data: [
          this.totalAdmins,
          this.totalUsuarios - this.totalAdmins
        ],
        backgroundColor: [
          '#34d399',
          '#fbbf24'
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { display: false }
        },
        y: {
          ticks: { color: textColor },
          grid: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
          }
        }
      }
    }
  });

}

actualizarGraficas() {
  this.vistasChart?.destroy();
  this.rolesChart?.destroy();

  this.crearGraficaVistas();
  this.crearGraficaRoles();
}


  async cargarUltimosMensajes() {
    const mensajesRef = collection(this.firestore, 'contacto');
    const q = query(mensajesRef, orderBy('fecha', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    this.ultimosMensajes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as any
  }));
  }

  verUsuario(email: string) {
  this.router.navigate(['/admin/gestion-usuarios', email]);
}

  verMensaje(correo: string) {
  this.router.navigate(['/admin/gestion-contacto', correo]);
}



}