import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Nino {
  id: number;
  nombre: string;
  edad: number;
  grupo: string;
  activo: boolean;
  progreso: number;
}

interface Alerta {
  tipo: 'warning' | 'info';
  icono: string;
  texto: string;
}

@Component({
  selector: 'app-gestion-ninos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-ninos.html',
  styleUrls: ['./gestion-ninos.css']
})
export class GestionNinos {
alertas: any;
ninosActivos: any;
promedioProgreso: any;
ninosRequierenAtencion: any;

ninos: Nino[] = [
  { id: 1,  nombre: 'Juan Pérez López',     edad: 5,  grupo: 'A1', activo: true,  progreso: 82 },
  { id: 2,  nombre: 'Sofía Ramírez García',  edad: 4,  grupo: 'B2', activo: true,  progreso: 68 },
  { id: 3,  nombre: 'Miguel Ángel Torres',   edad: 7,  grupo: 'A1', activo: false, progreso: 35 },
  { id: 4,  nombre: 'Valeria Gómez Sánchez', edad: 6,  grupo: 'B1', activo: true,  progreso: 91 },
  { id: 5,  nombre: 'Mateo Hernández Ruiz',  edad: 5,  grupo: 'A2', activo: true,  progreso: 47 },
  { id: 6,  nombre: 'Isabella Martínez',     edad: 8,  grupo: 'C1', activo: true,  progreso: 76 },
  { id: 7,  nombre: 'Diego López Vargas',    edad: 3,  grupo: 'B1', activo: false, progreso: 22 },
  { id: 8,  nombre: 'Camila Ortiz Mendoza',  edad: 6,  grupo: 'A1', activo: true,  progreso: 88 },
  { id: 9,  nombre: 'Santiago Rivera Cruz',  edad: 7,  grupo: 'C2', activo: true,  progreso: 59 },
  { id: 10, nombre: 'Lucía Fernández',       edad: 4,  grupo: 'B2', activo: false, progreso: 41 }
];
cancelarNuevo() {
throw new Error('Method not implemented.');
}
formularioValido: any;
agregarNino() {
throw new Error('Method not implemented.');
}

  seleccionados: Nino[] = [];

mostrarFormulario: any;
nuevoNino: any;

get ninosOrdenados(): Nino[] {
  return [...this.ninos].sort((a, b) => b.progreso - a.progreso);
}

estaSeleccionado(nino: Nino): boolean {
  return this.seleccionados.some(s => s.id === nino.id);
}

toggleSeleccion(nino: Nino, checked: boolean) {
  if (checked) {
    if (!this.estaSeleccionado(nino)) {
      this.seleccionados.push(nino);
    }
  } else {
    this.seleccionados = this.seleccionados.filter(s => s.id !== nino.id);
  }
}

toggleTodos(checked: boolean) {
  if (checked) {
    this.seleccionados = [...this.ninos];
  } else {
    this.seleccionados = [];
  }
}

deseleccionarTodo() {
  this.seleccionados = [];
}

cambiarEstadoSeleccionados(activo: boolean) {
  if (this.seleccionados.length === 0) return;
  
  this.seleccionados.forEach(nino => {
    nino.activo = activo;
  });
  
  // Opcional: mostrar toast o mensaje
  // this.seleccionados = []; // deseleccionar después de acción?
}

editarSeleccionados() {
  if (this.seleccionados.length === 0) return;
  if (this.seleccionados.length > 1) {
    alert('La edición múltiple no está implementada. Selecciona solo un niño para editar.');
    return;
  }
  this.editarNino(this.seleccionados[0]);
}
  editarNino(arg0: Nino) {
    throw new Error('Method not implemented.');
  }

eliminarSeleccionados() {
  if (this.seleccionados.length === 0) return;
  
  if (confirm(`¿Eliminar ${this.seleccionados.length} niño${this.seleccionados.length > 1 ? 's' : ''}?`)) {
    const ids = new Set(this.seleccionados.map(n => n.id));
    this.ninos = this.ninos.filter((n: { id: number; }) => !ids.has(n.id));
    this.seleccionados = [];
  }
}
}