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

  idAlumnoEditar: number = 0;

  isModalPassword: boolean = false;
  nuevaPassword: string = '';
  dniUsuario: string = '';

  public paginaActual: number = 1;
  public totalPaginas: number = 0;
  public totalRegistros: number = 0;
  public cantidadPorPagina: number = 10;

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

  abrirModal(alumno?:any){
    if(alumno){
      const fechaNacimientoFormat = alumno.fechaNacimiento ? alumno.fechaNacimiento.split('T')[0] : '';
      this.nuevoAlumno = {
        ...alumno,
        nombre: alumno.nombre,
        apellidos: alumno.apellidos,
        dni: alumno.dni,
        fechaNacimiento: fechaNacimientoFormat,
        sexo: alumno.sexo
      };
      this.isEditMode = true;
      this.idAlumnoEditar = alumno.id;
    } else{
      this.limpiardatos();
      this.isEditMode = false;
    }
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
    this.adminService.ontenerAlumnos(this.paginaActual, this.cantidadPorPagina).subscribe({
      next: (data:any) => {
        this.listaAlumno = data.items;
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
    this.cargarAlumnos();
  }
 
  registrarAlumno(){
    if(!this.nuevoAlumno.nombre || !this.nuevoAlumno.apellidos || !this.nuevoAlumno.dni || 
      !this.nuevoAlumno.fechaNacimiento || !this.nuevoAlumno.sexo){
        this.notifService.warning("Todos los campos son obligatorios");
        return;
      }

      const dniDuplicado = this.listaAlumno.find(a => a.dni === this.nuevoAlumno.dni && a.id !== this.nuevoAlumno.id);

      if(dniDuplicado){
        this.notifService.warning(`Ya existe un alumno con el DNI ${this.nuevoAlumno.dni}`);
        return;
      }

      if(this.nuevoAlumno.dni.length != 8){
        this.notifService.warning("El DNI debe tener exactamente 8 caractéres numericos");
        return;
      }
      const dniNumeros = /[0-9]+$/;
      if(!dniNumeros.test(this.nuevoAlumno.dni)){
        this.notifService.warning("DNI Invalido: El DNI solo debe tener números");
        return;
      }

    if(this.isEditMode){
      const idAlumno = this.idAlumnoEditar;
      this.adminService.update(idAlumno, this.nuevoAlumno).subscribe({
        next: () => {
          this.notifService.succes("Datos del alumno modificados");
          this.cerrarModal();
          this.limpiardatos();
          this.cargarAlumnos();
        },
        error: () => {
          this.notifService.error("Error al modificar datos del alumno");
          this.cerrarModal();
          this.limpiardatos();
        }
      })
    } else {

      this.adminService.CrearAlumno(this.nuevoAlumno).subscribe({
        next: (data) => {
          this.nuevoAlumno = data;
          this.notifService.succes('Alumno Creado');
          this.cargarAlumnos();
          this.cerrarModal();
        },
        error: (err) => {
          this.notifService.error('No se pudo crear el alumno');
          this.limpiardatos();
          this.cerrarModal();
        }
      }); 
    }  
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

  confirmarCambioPassword(){    
    const fuerteRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if(!fuerteRegex.test(this.nuevaPassword)){
      this.notifService.warning("La constraseña debe tener al menos 6 caracteres, un número, una mayúscula y un caractér especial");
      return;
    }

    const body = {
      nuevaPassword: this.nuevaPassword
    }

    this.adminService.updatePassword(this.dniUsuario, body).subscribe({
      next: () => {
        this.notifService.succes("Contraseña modificada");
        this.isModalPassword = false;
        this.nuevaPassword = '';
      },
      error: () => {
        this.notifService.error("No se pudo modificar la contraseña");
        this.isModalPassword = false;
        this.nuevaPassword = '';
      }
    });
  }

  isPasswordComplete(): boolean {
    return this.hasUpperCase() && this.hasNumber() && this.hasSpecial() && this.nuevaPassword.length >= 6;
  }

  hasUpperCase() { return /[A-Z]/.test(this.nuevaPassword); }
  hasNumber()    { return /\d/.test(this.nuevaPassword); }
  hasSpecial()   { return /[@$!%*?&#]/.test(this.nuevaPassword); }

  abrirModalPassword(alumno?:any){
    if(alumno){
      this.nuevoAlumno = {
        ...alumno,
        nombre: alumno.nombre
      }
      this.isModalPassword = true;
      this.dniUsuario = alumno.dni;

    }
    this.isModalPassword = true;
  }

  limpiarFiltro(){
    this.dniBuscar = '';
    this.cargarAlumnos();
  }

  limpiardatos(){
    this.nuevoAlumno.nombre = '';
    this.nuevoAlumno.apellidos = '';
    this.nuevoAlumno.dni = '';
    this.nuevoAlumno.fechaNacimiento = '';
    this.nuevoAlumno.dni = '';
    this.nuevoAlumno.id = 0;
    this.nuevoAlumno.estado = '';
  }
}
