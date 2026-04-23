import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocenteService } from '../../../core/services/docente.service';
import { FormsModule } from "@angular/forms";
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-docentes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-docentes.component.html',
  styleUrl: './admin-docentes.component.css'
})
export class AdminDocentesComponent implements OnInit{
  private docenteService = inject(DocenteService);
  private toastService = inject(NotificationServiceService);

  listaDocentes: any[] = [];

  isModalOpen: boolean = false;
  isModalPassword: boolean = false;
  nuevaPassword: string = '';
  dniUsuario: string = '';

  idDocente: number = 0;
  isEditMode: boolean = false;

  paginaActual: number = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  cantidadPorPagina: number = 10;
  
  public nuevoDocente = {
    id: 0,
    nombres: '',
    apellidos: '',
    dni: '',
    esActivo: true
  } 

  ngOnInit() {
    this.obtenerDocentes();
  }

  abrirModal(docente?:any){
    if(docente){
      this.nuevoDocente = {
        ...docente
      }
      this.idDocente = docente.id;
      this.isEditMode = true;
    } else{
      this.isEditMode = false;
      this.limpiarDatos();
    }
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  getInciales(nombres: string, apellidos: string): string {
    if(!nombres || !apellidos) return '??';

    const primerNombre = nombres.trim().split(/\s+/)[0];
    const incialNombre = primerNombre.charAt(0).toUpperCase();

    const primerApellido = apellidos.trim().split(/\s+/)[0];
    const inicalApellido = primerApellido.charAt(0).toUpperCase();

    return `${incialNombre}${inicalApellido}`;
  }
 
  obtenerDocentes() {
    this.docenteService.getAll(this.paginaActual, this.cantidadPorPagina).subscribe({
      next: (data) => {
        this.listaDocentes = data.items.map((docente: any) => ({
          ...docente,
          iniciales: this.getInciales(docente.nombres, docente.apellidos),
          estado: docente.esActivo ? 'Activo' : 'Inactivo',
        }));
        this.totalPaginas = data.totalPaginas;
        this.totalRegistros = data.totalRegistros;
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  cambiarPagina(nueva: number) {
    this.paginaActual = nueva;
    this.obtenerDocentes();
  }
 
  crearDocente() {
    if(!this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.dni){
      this.toastService.warning("Todos los datos son obligatorios");
      return;
    }

    const dniDuplicado = this.listaDocentes.find(d => d.dni === this.nuevoDocente.dni && d.id !== this.nuevoDocente.id);

    if(dniDuplicado){
      this.toastService.warning(`Ya existe un alumno con el DNI ${this.nuevoDocente.dni}`);
      return;
    }

    if(this.isEditMode) {
      this.docenteService.update(this.idDocente, this.nuevoDocente).subscribe({
        next: () => {
          this.toastService.succes("Dtos del docente actualizados");
          this.isModalOpen = false;
          this.limpiarDatos();
          this.obtenerDocentes();
        },
        error: () => {
          this.toastService.error("Error al modificar datos del docente");
          this.isModalOpen = false;
          this.limpiarDatos();
        }
      })
    } else {
      this.docenteService.agregarDocente(this.nuevoDocente).subscribe({
        next: (dataDocente) => {
          this.nuevoDocente = dataDocente;
          this.toastService.succes("Docente creado correctamente");
          this.cerrarModal();
          this.obtenerDocentes();
        },
        error: (err) => {
          this.toastService.error("Error al crear docente");
        }
      });
    }
  }

  modificarEstado(docente: any) {
    const nuevoEstado = !docente.esActivo; 
    this.idDocente = docente.id;

    const dto = {
      estado: nuevoEstado 
    };

    this.toastService.confirmar(
      "Confirmación", 
      `¿Estás seguro de que deseas ${nuevoEstado ? 'activar' : 'desactivar'} al docente?`
    ) 
    .then((result) => {
      if (result.isConfirmed) {
        this.docenteService.updateEstado(this.idDocente, dto).subscribe({
          next: () => {
            this.toastService.succes(`Docente ${nuevoEstado ? 'activado' : 'desactivado'}`);
            docente.esActivo = nuevoEstado;
          },
          error: (err) => {
            console.error("Error capturado:", err);
            this.toastService.error("No se pudo cambiar el estado");
          }
        });
      }
    });
  }

  modalPassword(docente?:any){
    if(docente){
      this.nuevoDocente = {
        ...docente,
        nombres: docente.nombres
      }
      this.isModalPassword = true;
      this.dniUsuario = docente.dni;
    }
    this.isModalPassword = true;
  }

  isPasswordComplete(): boolean{
    return this.hasUpperCase() && this.hasNumber() && this.hasSpecial() && this.nuevaPassword.length >= 6;
  }

  hasUpperCase() { return /[A-Z]/.test(this.nuevaPassword); }
  hasNumber()    { return /\d/.test(this.nuevaPassword); }
  hasSpecial()   { return /[@$!%*?&#]/.test(this.nuevaPassword); }

  confirmarCambioPassword() {
    const fuerteRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if(!fuerteRegex.test(this.nuevaPassword)){
      this.toastService.warning("La constraseña debe tener al menos 6 caracteres, un número, una mayúscula y un caractér especial");
      return;
    }

    const body = {
      nuevaPassword: this.nuevaPassword
    }

    this.docenteService.updatePassword(this.dniUsuario, body).subscribe({
      next: () => {
        this.toastService.succes("Password modificada");
        this.isModalPassword = false;
        this.nuevaPassword = '';
      },
      error: () => {
        this.toastService.error("Error al modificar la password del docente");
        this.isModalPassword = false;
        this.nuevaPassword = '';
      }
    });
  }

  limpiarDatos(){
    this.nuevoDocente.nombres = '';
    this.nuevoDocente.apellidos = '';
    this.nuevoDocente.dni = '';
  }
}
 