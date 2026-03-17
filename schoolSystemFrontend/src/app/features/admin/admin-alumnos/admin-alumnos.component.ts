import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-alumnos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-alumnos.component.html',
  styleUrl: './admin-alumnos.component.css'
})
export class AdminAlumnosComponent implements OnInit{
  private adminService = inject(AdminService);
  private notifService = inject(NotificationServiceService);

  listaAlumno: any[] = [];
  isModal: boolean = false;

  public nuevoAlumno = {
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    sexo: ''
  };
    
  ngOnInit() {
      this.cargarAlumnos();
  }

  cerrarModal(){
    this.isModal = false;
  }

  abrirModal(){
    this.isModal = true;
  }

  cargarAlumnos(){
    this.adminService.ontenerAlumnos().subscribe({
      next: (data) => {
        this.listaAlumno = data;
        console.log(data)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
 
  registrarAlumno(){
    this.adminService.CrearAlumno(this.nuevoAlumno).subscribe({
      next: (data) => {
        this.nuevoAlumno = data;
        this.notifService.succes('Alumno Creado');
        this.cargarAlumnos();
        this.cerrarModal();
      },
      error: (err) => {
        this.notifService.error('No se pudo crear el alumno');
        console.log(err);
      }
    })
    
  }
}
