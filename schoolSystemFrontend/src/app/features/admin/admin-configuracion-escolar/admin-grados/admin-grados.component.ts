import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradoServiceService } from '../../../../core/services/grado-service.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-grados', 
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-grados.component.html',
  styleUrl: './admin-grados.component.css'
})
export class AdminGradosComponent implements OnInit{

  private gradoSerice = inject(GradoServiceService);
  private toastService = inject(NotificationServiceService);

  listaGrado: any[] = [];
  idGradoSeleccionado: number = 0;

  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  nuevoGrado = {
    nombre: ''
  }

  ngOnInit() {
    this.obtenerGrados();
  }

  obtenerGrados() {
    this.gradoSerice.getAll().subscribe({
      next: (data) => {
        this.listaGrado = data;
        if(data){
          this.idGradoSeleccionado = data.id;
        }
      }
    });
  }

  crearGrado(){
    if(!this.nuevoGrado.nombre.trim()){
      this.toastService.warning("Todos los campos son obligatorios");
      return;
    }

    if(this.isEditMode){
      this.gradoSerice.update(this.idGradoSeleccionado, this.nuevoGrado).subscribe({
        next: () => {
          this.toastService.succes("Datos del grado modificados");
          this.cerrarModal();
          this.limpiarCampo();
          this.obtenerGrados();
        },
        error: () => {
          this.toastService.error("Error al modificar datos del grado");
          this.cerrarModal();
          this.limpiarCampo();
        }
      });
    } else {
      const datos = {
        nombre: this.nuevoGrado.nombre
      };

      this.gradoSerice.create(this.nuevoGrado).subscribe({
        next: () => {
          this.toastService.succes("Grado creado");
          this.obtenerGrados();
          this.cerrarModal();
          this.limpiarCampo();
        },
        error: () => {
          this.toastService.error("Error al crear grado");
        }
      });
    }
  }

  eliminar(id:number){
    console.log(id);
    this.toastService.confirmar("Advertencia","¿Estas seguro de eliminar este regitro?")
    .then((result) => {
      if(result.isConfirmed){
        this.gradoSerice.delete(id).subscribe({
          next: () => {
            this.toastService.succes("Registro eliminado");
            this.obtenerGrados();
          },
          error: () => {
            this.toastService.error("Error al eliminar registro");
          }
        });
      }
    });
  }

  abrirModal(grado?: any){
    if(grado){
      this.nuevoGrado = {
        ...grado,
        nombre: grado.nombre
      };
      this.isEditMode = true;
      this.idGradoSeleccionado = grado.id;
    } else {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.limpiarCampo();
    }
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }      

  limpiarCampo(){
    this.nuevoGrado.nombre = '';
  }
}
