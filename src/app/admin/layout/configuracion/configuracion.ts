import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {

  perfil = {
    nombre: '',
    email: '',
    rol: 'admin'
  };

  prefs = {
    darkMode: false,
    alertas: true,
    emailNotif: false,
    idioma: 'es'
  };

  password = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  constructor() {
    this.cargarDatos();
  }

ngOnInit() {
  const saved = localStorage.getItem('prefs');

  if (saved) {
    this.prefs = JSON.parse(saved);
  }

  if (this.prefs.darkMode) {
    document.body.classList.add('dark');
  }
}

  cargarDatos() {
    const perfilGuardado = localStorage.getItem('perfil');
    const prefsGuardadas = localStorage.getItem('prefs');

    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
    }

    if (prefsGuardadas) {
      this.prefs = JSON.parse(prefsGuardadas);
      document.body.classList.toggle('dark', this.prefs.darkMode);
    }
  }

  // 🔹 GUARDAR PERFIL
  guardarPerfil() {
    if (!this.perfil.nombre || !this.perfil.email) {
      alert('Completa los campos');
      return;
    }

    localStorage.setItem('perfil', JSON.stringify(this.perfil));
    alert('Perfil guardado correctamente');
  }

guardarPreferencias() {
  localStorage.setItem('prefs', JSON.stringify(this.prefs));

  document.body.classList.toggle('dark', this.prefs.darkMode);
}

  cambiarPassword() {
    if (!this.password.actual || !this.password.nueva || !this.password.confirmar) {
      alert('Completa todos los campos');
      return;
    }

    if (this.password.nueva !== this.password.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    alert('Contraseña actualizada correctamente');

    // limpiar campos
    this.password = {
      actual: '',
      nueva: '',
      confirmar: ''
    };
  }

}