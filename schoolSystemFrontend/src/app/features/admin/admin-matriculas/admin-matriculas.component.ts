import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';
import { ConfiguracionCuposService } from '../../../core/services/configuracion-cupos.service';

@Component({
  selector: 'app-admin-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-matriculas.component.html',
  styleUrl: './admin-matriculas.component.css'
})
export class AdminMatriculasComponent implements OnInit {
 
  private adminService = inject(AdminService);
  private gradoService = inject(GradoServiceService);
  private seccionesService = inject(SeccionServiceService);
  private matriculaService = inject(MatriculaService);
  private alertService = inject(NotificationServiceService);
  private configSerice = inject(ConfiguracionCuposService);

  dni: string = '';
  listGrado: any[] = [];
  listaSecciones: any[] = [];
  gradoDetino: number = 0;
  seccionDestino: number = 0;

  mostrarModalCupos: boolean = false;
  verAlternativas: boolean = false;
  aulaSeleccionadaNombre: string = '';
  listaAlternativas: any[] = [];
  listaGeneralCupos: any[] = [];

  idGradoCupos: number = 0;

  mostrarModalModificar: boolean = false;

  nuevaSeccionId: number = 0;

  alumno = {
    id: 0,
    nombre: '',
    apellidos: '',
    dni: '',
    aula: '',
    periodoAcademico: '',
    gradoId: 0,
    matriculaId: 0
  };

  ngOnInit() {    
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
          //console.log(dataAlumno);
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
      periodoAcademico: '',
      gradoId: 0,
      matriculaId: 0
    };
    this.gradoDetino = 0;
    this.seccionDestino = 0;
  }

  mostrarGrado(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
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

    this.matriculaService.registrarMatricula(dataMatricula).subscribe({
      next: () => {
        this.alertService.succes('Alumno matriculado correctamente');
        this.limpiarBusqueda();
      },
      error: (err) => {
        const errorMsg = err.error || '';
        console.log("Mensaje capturado:", errorMsg);

        if (err.status === 400 && errorMsg.toString().includes('Cupos')) {
          this.abrirAlertaCupos();
        } else {
          this.alertService.error(errorMsg || 'Error al procesar matrícula');
          
        }
      }
    });
  }

  abrirAlertaCupos() {
    const gNombre = this.listGrado.find(g => g.id == this.gradoDetino)?.nombre;
    const sNombre = this.listaSecciones.find(s => s.id == this.seccionDestino)?.nombre;
    
    this.aulaSeleccionadaNombre = `${gNombre} ${sNombre}`;
    this.mostrarModalCupos = true;
    this.verAlternativas = false;
  }

  consultarDisponibilidad() {
    if(this.gradoDetino > 0){
      this.configSerice.getByGrado(this.gradoDetino).subscribe({
        next: (data) => {
          this.listaAlternativas = data;
          this.verAlternativas = true;
        },
        error: () => {
          this.alertService.error("No se pudo cargar la lista de grados disponibles");
        }
      })
    }
  }

  habilitarModificacion(){
    this.mostrarModalModificar = true;

    const gradoId = Number(this.alumno.gradoId);
    
    this.configSerice.getByGrado(gradoId).subscribe({
      next: (data) => {
        this.listaAlternativas = data;        
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  confirmarCambioSeccion(){
    const idMatricula = Number(this.alumno.matriculaId);
    const nuevaSeccion = {
      gradoId: Number(this.alumno.gradoId),
      seccionId: Number(this.nuevaSeccionId),
    }
    
    this.matriculaService.update(idMatricula, nuevaSeccion).subscribe({
      next: () => {
        this.alertService.succes("Cambio de sección realizado");
        this.mostrarModalModificar = false;
        this.limpiarBusqueda();
      },
      error: () => {
        this.alertService.error("Error al cambiar de sección");
        this.mostrarModalModificar = false;
        this.limpiarBusqueda();
      }
    });
  }

  cerrarModalCupos() {
    this.mostrarModalCupos = false;
    this.verAlternativas = false;
  }

  cancelar(){
    this.dni = ''; 
    this.alumno = {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      aula: '',
      periodoAcademico: '',
      gradoId: 0,
      matriculaId: 0
    };
    this.gradoDetino = 0;
    this.seccionDestino = 0;
  }
}