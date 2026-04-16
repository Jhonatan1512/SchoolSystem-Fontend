import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';
import { NotificationServiceService } from '../../../core/services/notification.service.service';
import { EstadoAlumno } from './admin-estado-alumno';

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
  modalEstado: boolean = false;

  nombreAlumnoEditar: string = '';
  apellidosEstudiante: string = '';
  idAlumnoSeleccionado: Number = 0;
  isEditMode: boolean = false;
  dniBuscar: string = '';

  nuevoAlumno = {
    id: 0,
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    sexo: '',
    estado: ''
  };

  public listaEstado = [
    {id: EstadoAlumno.Activo, nombre: 'Activo'},
    {id: EstadoAlumno.Trasladado, nombre: 'Trasladado'},
    {id: EstadoAlumno.Retirado, nombre: 'Retirado'}
  ]

  public estadoAlumno: number = EstadoAlumno.Activo;
    
  ngOnInit() {
      this.cargarAlumnos();
  }

  cerrarModal(){
    this.isModal = false;
  }

  abrirModal(){
    this.isModal = true;
  }

  editarEstado(estudiante?: any){
    if(estudiante){
      this.nuevoAlumno = {
        ...estudiante,
        estado: estudiante.estado
      };
      this.isEditMode = true;
      this.idAlumnoSeleccionado = Number(estudiante.id);
      this.nombreAlumnoEditar = estudiante.nombre;
      this.apellidosEstudiante = estudiante.apellidos;
      this.estadoAlumno = estudiante.estado;
    }
    this.modalEstado = true;
  }

  cerrarModalEstado(){
    this.modalEstado = false;
  }

  cargarAlumnos(){
    this.adminService.ontenerAlumnos().subscribe({
      next: (data) => {
        this.listaAlumno = data;
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
    });    
  }

  acualizarEstado(){
    var alumnoId = Number(this.idAlumnoSeleccionado);
    const nuevoEstado = {
      estado: this.estadoAlumno
    }
    this.adminService.updateEstado(alumnoId, nuevoEstado).subscribe({
      next: () => {
        this.notifService.succes("Se actualizo la situación del alumno");
        this.cargarAlumnos();
        this.cerrarModalEstado();
      },
      error: () => {
        this.notifService.error("Error al actualizar situación del alumno");
        this.cerrarModalEstado();
      }
    });
  }  

  buscarPorDni(){
    if(!this.dniBuscar){
      this.notifService.warning("Debe ingresar un DNI");
      return;
    }
    this.adminService.getByDni(this.dniBuscar).subscribe({
      next: (data) => {
        if(data){
          this.listaAlumno = [data];
        
        } else {
          this.notifService.warning("No se encontro ningún resultado");
          this.dniBuscar = '';
        }
      },
      error: () => {
        this.notifService.error("Alumno no encotrado");
        this.dniBuscar = '';
      }
    });
  }

  limpiarFiltro(){
    this.dniBuscar = '';
    this.cargarAlumnos();
  }
}
