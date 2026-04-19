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

  idDocente: number = 0;
  isEditMode: boolean = false;
  
  public nuevoDocente = {
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
    this.docenteService.getAll().subscribe({
      next: (data) => {
        this.listaDocentes = data.map((docente: any) => ({
          ...docente,
          iniciales: this.getInciales(docente.nombres, docente.apellidos),
          estado: docente.esActivo ? 'Activo' : 'Inactivo',
        }));
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }
 
  crearDocente() {
    if(!this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.dni){
      this.toastService.warning("Todos los datos son obligatorios");
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

  limpiarDatos(){
    this.nuevoDocente.nombres = '';
    this.nuevoDocente.apellidos = '';
    this.nuevoDocente.dni = '';
  }
}
 