import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsignacionDocenteService } from '../../../core/services/asignacion-docente.service';
import { DocenteService } from '../../../core/services/docente.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';
import { PeriodoService } from '../../../core/services/periodo.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-asignacion-docente',
  standalone: true, 
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-asignacion-docente.component.html',
  styleUrl: './admin-asignacion-docente.component.css'
})
export class AdminAsignacionDocenteComponent implements OnInit {
  private asignacionService = inject(AsignacionDocenteService);
  private docenteService = inject(DocenteService);
  private gradoService = inject(GradoServiceService);
  private seccionService = inject(SeccionServiceService);
  private periodoService = inject(PeriodoService);
  private toastService = inject(NotificationServiceService);

  listaDocentes: any[] = [];
  isModalOpen: boolean = false;

  docenteEncontrado = {
    id: 0,
    dni: '',
    nombreCompleto: '',
    esActivo: false
  };

  gradoSeleccionadoId: number | null = null;
  seccionSeleccionadaId: number | null = null;
  
  cursosDelGrado: any[] = []; 
  cursosSeleccionadosParaAsignar: number[] = []; 

  listaGrados: any[] = [];
  listaSecciones: any[] = [];
  periodoActivo = { id: 0, nombre: '' };

  ngOnInit() { 
    this.mostrarDocentesAsignados(); 
    this.obtenerGrados();  
    this.obtenerSecciones(); 
    this.obtenerPeriodo();
  }

  onGradoChange() {
    if (!this.gradoSeleccionadoId) {
      this.cursosDelGrado = [];
      this.cursosSeleccionadosParaAsignar = [];
      return;
    }

    this.gradoService.getById(this.gradoSeleccionadoId).subscribe({
      next: (data) => {
        this.cursosDelGrado = data.cursos; 
        this.cursosSeleccionadosParaAsignar = []; 
      },
      error: (err) => console.error("Error al cargar detalle del grado:", err)
    });
  }

  isCursoChecked(cursoId: number): boolean {
    return this.cursosSeleccionadosParaAsignar.includes(cursoId);
  }

  toggleCurso(cursoId: any) {
    const id = Number(cursoId); 
    const index = this.cursosSeleccionadosParaAsignar.indexOf(id);
    
    if (index > -1) {
      this.cursosSeleccionadosParaAsignar.splice(index, 1);
      //console.log("Quitado:", id);
    } else {
      this.cursosSeleccionadosParaAsignar.push(id);
      //console.log("Agregado:", id);
    }
    console.log("Seleccionados:", this.cursosSeleccionadosParaAsignar);
  }

  confirmarAsignacion() {
    if(this.docenteEncontrado.esActivo == false){
      this.toastService.warning("El docente esta inactivo")
      return;
    }

    if (!this.docenteEncontrado.id || !this.seccionSeleccionadaId || this.cursosSeleccionadosParaAsignar.length === 0) {
      this.toastService.warning("Compelete todos los campos");
      return;
    }

    const dto = {
      docenteId: this.docenteEncontrado.id,
      cursosIds: this.cursosSeleccionadosParaAsignar,
      gradoId: Number(this.gradoSeleccionadoId),
      seccionId: Number(this.seccionSeleccionadaId),
      periodoAcademicoId: this.periodoActivo.id,      
    };

    this.asignacionService.asignarDocentes(dto).subscribe({
      next: () => {
        this.toastService.succes("Asignación realizada con exíto");
        this.cerrarModal();
        this.mostrarDocentesAsignados();
      },
      error: (err) => alert("Error al asignar: " + (err.error || err.message))
    }); 
  }


  abrirModal() {
    this.isModalOpen = true;
    this.resetForm();
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  resetForm() {
    this.docenteEncontrado = { id: 0, dni: '', nombreCompleto: '', esActivo: false };
    this.gradoSeleccionadoId = null;
    this.seccionSeleccionadaId = null;
    this.cursosDelGrado = [];
    this.cursosSeleccionadosParaAsignar = [];
  }

  ObtenerDocente() {
    if (!this.docenteEncontrado.dni) {
      this.toastService.warning("Ingrese el DNI del docente");
      return;
    };

    this.docenteService.getByDni(this.docenteEncontrado.dni).subscribe({
      next: (data) => {
        this.docenteEncontrado = {
          id: data.id,
          dni: data.dni,
          nombreCompleto: `${data.nombres} ${data.apellidos}`.trim(),
          esActivo: data.esActivo
        };        
      },
      error: () => {
        this.toastService.error("No existe un docente con ese DNI");
        this.docenteEncontrado.dni = '';
      }
    });
  }

  obtenerGrados() {
    this.gradoService.getAll().subscribe({
      next: (data) => this.listaGrados = data,
      error: (err) => console.log(err)
    });
  }

  obtenerSecciones() {
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => this.listaSecciones = data,
      error: (err) => console.log(err)
    });
  }

  obtenerPeriodo() {
    this.periodoService.getPeriodoActivo().subscribe({
      next: (data) => this.periodoActivo = data,
      error: (err) => console.log(err)
    });
  }

  mostrarDocentesAsignados() {
    this.asignacionService.getAll().subscribe({
      next: (data) => {
        this.listaDocentes = data.map((docente: any) => ({
          ...docente,
          textEstado: docente.estado ? 'Activo' : 'Inactivo',
          iniciales: this.getIciales(docente.nombreDocente)
        }));
      }
    });
  }

  getIciales(nombreCompleto: string): string {
    if (!nombreCompleto) return '??';
    return nombreCompleto.trim().split(/\s+/).map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }
}