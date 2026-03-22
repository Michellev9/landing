import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})

export class GestionUsuarios implements OnInit {

  errorCreate: any = {};
  errorEdit: any = {};
  listaUsuarios: any[] = [];
  selectedUsers: any[] = [];
  searchText: string = '';
  usuariosFiltradosList: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;

  newUser = {email: '', rol: 'usuario', modulo: 'landing'};

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  userEditando: any = null;
  

  constructor(private firestore: Firestore) {
    this.usuariosFiltradosList = this.listaUsuarios;
  }

  async ngOnInit() {
    await this.obtenerUsuarios();
  }

  validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async crearUsuario() {

  if (!this.validarCrearUsuario()) return;

  try {
    await addDoc(collection(this.firestore, 'usuariosWeb'), {
      ...this.newUser,
      fecha: new Date()
    });

    this.newUser = { email: '', rol: 'usuario', modulo: 'landing' };
    this.errorCreate = {};
    this.showCreateModal = false;

    await this.obtenerUsuarios();

  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}

validarCrearUsuario(): boolean {
  this.errorCreate = {};

  if (!this.newUser.email) {
    this.errorCreate.email = 'El correo es obligatorio';
  } else if (!this.validarEmail(this.newUser.email)) {
    this.errorCreate.email = 'Correo inválido';
  }

  if (!this.newUser.rol) {
    this.errorCreate.rol = 'Selecciona un rol';
  }

  if (!this.newUser.modulo) {
    this.errorCreate.modulo = 'Selecciona un módulo';
  }

  return Object.keys(this.errorCreate).length === 0;
}

abrirEdicion() {
  if (this.selectedUsers.length !== 1) return;

  this.userEditando = { ...this.selectedUsers[0] };
  this.showEditModal = true;
}

async actualizarUsuario() {

  if (!this.validarEditarUsuario()) return;

  try {
    const ref = doc(this.firestore, `usuariosWeb/${this.userEditando.id}`);

    await updateDoc(ref, {
      email: this.userEditando.email,
      rol: this.userEditando.rol,
      modulo: this.userEditando.modulo
    });

    this.errorEdit = {};
    this.showEditModal = false;
    this.selectedUsers = [];

    await this.obtenerUsuarios();

  } catch (error) {
    console.error('Error al actualizar:', error);
  }
}

validarEditarUsuario(): boolean {
  this.errorEdit = {};

  if (!this.userEditando.email) {
    this.errorEdit.email = 'El correo es obligatorio';
  } else if (!this.validarEmail(this.userEditando.email)) {
    this.errorEdit.email = 'Correo inválido';
  }

  if (!this.userEditando.rol) {
    this.errorEdit.rol = 'Selecciona un rol';
  }

  if (!this.userEditando.modulo) {
    this.errorEdit.modulo = 'Selecciona un módulo';
  }

  return Object.keys(this.errorEdit).length === 0;
}

  async obtenerUsuarios() {
    try {
      const snapshot = await getDocs(collection(this.firestore, 'usuariosWeb'));

      this.listaUsuarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.usuariosFiltradosList = [...this.listaUsuarios];

      console.log('Usuarios cargados:', this.listaUsuarios);

    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

toggleSelection(user: any) {
  const exists = this.selectedUsers.find(u => u.id === user.id);

  if (exists) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  } else {
    this.selectedUsers = [...this.selectedUsers, user];
  }
}

isSelected(user: any): boolean {
  return this.selectedUsers.some(u => u.id === user.id);
}

async eliminarSeleccionadosConfirmado() {
  try {
    for (let user of this.selectedUsers) {
      await deleteDoc(doc(this.firestore, `usuariosWeb/${user.id}`));
    }

    this.selectedUsers = [];
    this.showDeleteModal = false;

    await this.obtenerUsuarios();

  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}

get todosSeleccionados(): boolean {
  return this.usuariosFiltradosList.length > 0 &&
         this.selectedUsers.length === this.usuariosFiltradosList.length;
}

toggleSeleccionarTodos(event: any) {
  const checked = event.target.checked;

  if (checked) {
    this.selectedUsers = [...this.usuariosFiltradosList];
  } else {
    this.selectedUsers = [];
  }
}

filtrarUsuarios() {
  const texto = this.searchText.toLowerCase().trim();

  if (!texto) {
    this.usuariosFiltradosList = [...this.listaUsuarios];
  } else {
    this.usuariosFiltradosList = this.listaUsuarios.filter(user =>
      user.email?.toLowerCase().includes(texto) ||
      user.rol?.toLowerCase().includes(texto)
    );
  }
  this.currentPage = 1;
  this.selectedUsers = this.selectedUsers.filter(selected =>
    this.usuariosFiltradosList.some(u => u.id === selected.id)
  );
}

get usuariosPaginados() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.usuariosFiltradosList.slice(start, end);
}

get totalPaginas(): number {
  return Math.ceil(this.usuariosFiltradosList.length / this.itemsPerPage);
}

cambiarPagina(pagina: number) {
  if (pagina < 1 || pagina > this.totalPaginas) return;
  this.currentPage = pagina;
}
}
