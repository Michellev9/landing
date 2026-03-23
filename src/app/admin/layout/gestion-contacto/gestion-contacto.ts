import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc, query, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-gestion-contacto',
  templateUrl: './gestion-contacto.html',
  styleUrls: ['./gestion-contacto.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe]
})
export class GestionContacto {

  mensajes: any[] = [];
  mensajesFiltradosList: any[] = [];
  mensajesPaginados: any[] = [];
  selectedMensajes: any[] = [];
  todosSeleccionados = false;
  respuestaTexto: string = '';

  searchText = '';
  currentPage = 1;
  totalPaginas = 1;

  showDetailModal = false;
  showDeleteModal = false;
  mmensajeId: string | null = null;
  mensajeSeleccionado: any = null;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    try {
      const mensajesRef = collection(this.firestore, 'contacto');
      const q = query(mensajesRef, orderBy('fecha', 'desc'));

      collectionData(q, { idField: 'id' }).subscribe((data: any[]) => {
        this.mensajes = data.map(m => ({
          ...m,
          fecha: m.fecha?.toDate ? m.fecha.toDate() : new Date(m.fecha)
        }));
        this.filtrarMensajes();
      });
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  }

  filtrarMensajes() {
    this.mensajesFiltradosList = this.mensajes.filter(m =>
      (m.nombre ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
      (m.correo ?? '').toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPaginas = Math.ceil(this.mensajesFiltradosList.length / 5) || 1;
    this.cambiarPagina(1);
  }

  cambiarPagina(page: number) {
    if (page < 1 || page > this.totalPaginas) return;
    this.currentPage = page;
    const start = (page - 1) * 5;
    this.mensajesPaginados = this.mensajesFiltradosList.slice(start, start + 5);
  }

toggleSeleccionarTodos(event: any) {
  this.todosSeleccionados = event.target.checked;
  this.selectedMensajes = this.todosSeleccionados ? [...this.mensajesFiltradosList] : [];
}


  toggleSelection(msg: any) {
    if (this.isSelected(msg)) {
      this.selectedMensajes = this.selectedMensajes.filter(m => m.id !== msg.id);
    } else {
      this.selectedMensajes.push(msg);
    }
  }

isSelected(msg: any) {
  return this.selectedMensajes.some(m => m.id === msg.id);
}

  abrirDetalle() {
    if (this.selectedMensajes.length === 1) {
      this.mensajeSeleccionado = this.selectedMensajes[0];
      this.showDetailModal = true;
    }
  }

  async eliminarSeleccionadosConfirmado() {
    for (let msg of this.selectedMensajes) {
      const docRef = doc(this.firestore, 'contacto', msg.id);
      await deleteDoc(docRef);
    }
    this.selectedMensajes = [];
    this.showDeleteModal = false;
    this.filtrarMensajes();
  }

  async responderMensaje() {
    if (!this.respuestaTexto.trim()) {
      alert('Debes escribir una respuesta antes de enviar.');
      return;
    }

    try {
      console.log(`Respuesta para ${this.mensajeSeleccionado.correo}: ${this.respuestaTexto}`);

      const docRef = doc(this.firestore, 'contacto', this.mensajeSeleccionado.id);
      await deleteDoc(docRef);

      this.showDetailModal = false;
      this.respuestaTexto = '';
      this.selectedMensajes = [];
      this.filtrarMensajes();

    } catch (error) {
      console.error('Error al responder/eliminar mensaje:', error);
    }
  }

}