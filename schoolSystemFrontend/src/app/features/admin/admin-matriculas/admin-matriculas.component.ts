import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importante para ngModel
  templateUrl: './admin-matriculas.component.html',
  styleUrl: './admin-matriculas.component.css'
})
export class AdminMatriculasComponent implements OnInit {

  private adminService = inject(AdminService);
  private gradoService = inject(GradoServiceService);
  private seccionesService = inject(SeccionServiceService);
  private matriculaService = inject(MatriculaService);
  private alertService = inject(NotificationServiceService);

  dni: string = '';

  listGrado: any[] = [];
  listaSecciones: any[] = [];

  gradoDetino: number = 0;
  seccionDestino: number = 0;

  alumno = {
    id: 0,
    nombre: '',
    apellidos: '',
    dni: '',
    aula: '',
    periodoAcademico: ''
  };

  ngOnInit() {   
    //this.obtenerAlumno();  
    this.mostrarGrado() 
    this.mostrarSecciones();
  }

  obtenerAlumno() {
    if(!this.dni || this.dni === ''){
      this.alertService.warning('Por favor, ingrese un número de DNI');
      return;
    } 

    this.adminService.getByDni(this.dni).subscribe({
      next: (dataAlumno) => {
        if(dataAlumno){
          this.alumno = dataAlumno;
        }  else {
        this.limpiarBusqueda();
        this.alertService.warning('No se encontró alumno con ese DNI');
      }       
        
      },
       error: (err) => {
        this.limpiarBusqueda();
        if(err.status === 404){
          this.alertService.warning('No existe alumno con este DNI');
        } else {
          this.alertService.error('Ocurrió un error al conectar con el servidor');
        }
       }
    });
  }

  limpiarBusqueda(){
    this.dni = ''; 
    this.alumno = {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      aula: '',
      periodoAcademico: ''
    };
    this.gradoDetino = 0;
    this.seccionDestino = 0;
  }

  mostrarGrado(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        //console.log(data);
        this.listGrado = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  mostrarSecciones(){
    this.seccionesService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  matricular(){
    if(!this.alumno.id || !this.gradoDetino || !this.seccionDestino){
      this.alertService.warning('Todos los campos son obligatorios');
      return;
    }

    const dataMatricula = {
      alumnoId: this.alumno.id,
      gradoId: Number(this.gradoDetino),
      seccionId: Number(this.seccionDestino)
    };

    //console.log("Datos a enviar ", dataMatricula);

    this.matriculaService.registrarMatricula(dataMatricula).subscribe({
      next: () => {
        this.alertService.succes('Alumno matriculado correctamente');
        this.limpiarBusqueda();
      },
      error: (err) => {
        this.alertService.error('Error: no se pudo matricular al alumno');
      }
    });
  }

  cancelar(){
    this.dni = ''; 
    this.alumno = {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      aula: '',
      periodoAcademico: ''
    };
    this.gradoDetino = 0;
    this.seccionDestino = 0;
  }
}