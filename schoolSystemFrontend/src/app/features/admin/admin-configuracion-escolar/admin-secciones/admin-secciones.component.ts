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

  nuevaSeccion = {
    nombre: ''
  };

  ngOnInit() {
    this.obtenerDetallesSeccionGrado();
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }

  obtenerDetallesSeccionGrado(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
        console.log(data);
      }
    });
  }

  crearSeccion(){  
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
        console.log(this.nuevaSeccion);
      },
      error: (err) => {
        this.toastService.error("Error al crear Sección");
        console.log(err);
        this.cerrarModal();
      }
    });
  }

  limpiarCamos(){
    this.nuevaSeccion.nombre ='';
  }
}
