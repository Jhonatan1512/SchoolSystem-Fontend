import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeccionServiceService } from '../../../../core/services/seccion-service.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-secciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-secciones.component.html',
  styleUrl: './admin-secciones.component.css'
})

export class AdminSeccionesComponent implements OnInit{
 
  private seccionService = inject(SeccionServiceService);
  private toastService = inject(NotificationServiceService);

  isModalOpen: boolean = false;

  listaSecciones: any[] = [];

  isEditMode: boolean = false;
  idSeccionSelecionada: number = 0;

  nuevaSeccion = {
    nombre: ''
  };

  ngOnInit() {
    this.obtenerDetallesSeccionGrado();
  }

  abrirModal(seccion?: any){
    if(seccion){
      this.nuevaSeccion = {
        ...seccion,
        nombre: seccion.nombre
      };
      this.isEditMode = true;
      this.idSeccionSelecionada = seccion.id;
    } else {
      this.limpiarCamos();
      this.isEditMode = false;
      this.idSeccionSelecionada = 0;
    }
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }

  obtenerDetallesSeccionGrado(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      }
    });
  }

  crearSeccion(){  
    if(!this.nuevaSeccion.nombre){
      this.toastService.warning("Todos los campos son obligatorios");
      this.cerrarModal();
      return;
    }
    if(this.isEditMode){
      this.seccionService.update(this.idSeccionSelecionada, this.nuevaSeccion).subscribe({
        next: () => {
          this.toastService.succes("Registro de sección actualizado");
          this.obtenerDetallesSeccionGrado();
          this.cerrarModal();
        },
        error: () => {
          this.toastService.error("Error al actualizar registri de sección");
          this.cerrarModal();
        }
      });
    } else {
      console.log("Objeto completo:", this.nuevaSeccion);
      const data = {
        nombre: this.nuevaSeccion.nombre
      };

      console.log(data);
      this.seccionService.create(data).subscribe({
        next: () => {
          this.toastService.succes("Sección creada");
          this.cerrarModal();
          this.obtenerDetallesSeccionGrado();
          //console.log(this.nuevaSeccion);
        },
        error: (err) => {
          this.toastService.error("Error al crear Sección");
          console.log(err);
          this.cerrarModal();
        }
      });
    }
  }

  deleteSeccion(id: number){
    this.toastService.confirmar("Advertencia","¿Estas seguro de eliminar este registro?")
    .then((result) => {
      if(result.isConfirmed){
        this.seccionService.delete(id).subscribe({
          next: () => {
            this.toastService.succes("Registro de sección eliminado");
            this.obtenerDetallesSeccionGrado();
          },
          error: () => {
            this.toastService.error("Error al eliminar registro");
          }
        });
      }
    });
  }

  limpiarCamos(){
    this.nuevaSeccion.nombre ='';
  }

}
