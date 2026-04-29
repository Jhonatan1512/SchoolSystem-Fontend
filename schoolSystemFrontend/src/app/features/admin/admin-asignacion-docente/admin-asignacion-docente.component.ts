import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsignacionDocenteService } from '../../../core/services/asignacion-docente.service';
import { DocenteService } from '../../../core/services/docente.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { CursosService } from '../../../core/services/cursos.service';
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
  private cursoService = inject(CursosService);
  private docenteService = inject(DocenteService);
  private gradoService = inject(GradoServiceService);
  private seccionService = inject(SeccionServiceService);
  private periodoService = inject(PeriodoService);
  private toastService = inject(NotificationServiceService);

  listaDocentes: any[] = [];
  listaFiltrada: any[] = [];
  isModalOpen: boolean = false;
  isAulaSelected: boolean = false;
  
  docenteEncontrado = { id: 0, dni: '', nombreCompleto: '', esActivo: false, horasAsignadas: 0, horasRestantes: 0 };
  gradoSeleccionadoId: number | null = null;
  seccionSeleccionadaId: number | null = null;

  cursosDelGrado: any[] = [];
  cursosSeleccionadosParaAsignar: { planEstudioId: number, horasAsignadas: number }[] = [];

  listaGrados: any[] = [];
  listaSecciones: any[] = [];
  periodoActivo = { id: 0, nombre: '' };

  gradoId: number | null = null;
  seccionId: number = 0;

  public paginaActual: number = 1;
  public totalPaginas: number = 0;
  public totalRegistros: number = 0;
  public cantidadPorPagina: number = 15;
  
  ngOnInit() {
    this.mostrarDocentesAsignados();
    this.obtenerGrados();
    this.obtenerSecciones();
    this.obtenerPeriodo();
  }

  onGradoChange() {
    if (!this.gradoSeleccionadoId || !this.seccionSeleccionadaId) {
      this.cursosDelGrado = [];
      this.cursosSeleccionadosParaAsignar = [];
      return;
    }
    this.cursoService.getByGradoSeccion(this.gradoSeleccionadoId, this.seccionSeleccionadaId).subscribe({
      next: (data) => {
        this.cursosDelGrado = data.cursos || data;
        this.cursosSeleccionadosParaAsignar = [];
      },
      error: (err) => console.error("Error al cargar cursos:", err)
    });
  }

  isCursoChecked(planId: number): boolean {
    return this.cursosSeleccionadosParaAsignar.some(c => Number(c.planEstudioId) === Number(planId));
  }

  toggleCurso(curso: any) {
    if (curso.horasRestantes <= 0) return;

    const pId = Number(curso.planId);
    const index = this.cursosSeleccionadosParaAsignar.findIndex(c => Number(c.planEstudioId) === pId);

    if (index > -1) {
      this.cursosSeleccionadosParaAsignar.splice(index, 1);
    } else {
      this.cursosSeleccionadosParaAsignar.push({
        planEstudioId: pId,
        horasAsignadas: curso.horasRestantes 
      });
    }
  }

  updateHoras(planId: number, event: any) {
    const valor = Number(event.target.value);
    const item = this.cursosSeleccionadosParaAsignar.find(c => c.planEstudioId === planId);
    if (item) {
      item.horasAsignadas = valor;
    }
  }

  getHorasValue(planId: number): number {
    const item = this.cursosSeleccionadosParaAsignar.find(c => c.planEstudioId === planId);
    return item ? item.horasAsignadas : 1;
  }

  confirmarAsignacion() {
    if (!this.docenteEncontrado.esActivo) {
      this.toastService.warning("El docente está inactivo");
      return;
    }

    if (!this.docenteEncontrado.id || !this.seccionSeleccionadaId || this.cursosSeleccionadosParaAsignar.length === 0) {
      this.toastService.warning("Complete todos los campos obligatorios");
      return;
    }

    const totalHorasAsignar = this.totalHorasSeleccionadas;

    if (totalHorasAsignar > this.docenteEncontrado.horasRestantes) {
      this.toastService.warning(
        `Horas insuficientes. Disponible: ${this.docenteEncontrado.horasRestantes}h`
      );
      return;
    }

    const dto = {
      docenteId: this.docenteEncontrado.id,
      planesEstudio: this.cursosSeleccionadosParaAsignar,
      gradoId: Number(this.gradoSeleccionadoId),
      seccionId: Number(this.seccionSeleccionadaId),
      periodoAcademicoId: this.periodoActivo.id
    };

    this.asignacionService.asignarDocentes(dto).subscribe({
      next: () => {
        this.toastService.succes("Asignación realizada con éxito");
        this.cerrarModal();
        this.mostrarDocentesAsignados();
      },
      error: (err) => {
        const mensaje = err.error?.mensaje || "Error al asignar docente";
        this.toastService.error(mensaje);
      }
    });
  }

  get totalHorasSeleccionadas(): number {
    return this.cursosSeleccionadosParaAsignar
      .reduce((total, c) => total + c.horasAsignadas, 0);
  }

  abrirModal() { this.isModalOpen = true; this.resetForm(); }
  cerrarModal() { this.isModalOpen = false; }
  
  resetForm() {
    this.docenteEncontrado = { id: 0, dni: '', nombreCompleto: '', esActivo: false, horasAsignadas: 0, horasRestantes: 0 };
    this.gradoSeleccionadoId = null; 
    this.seccionSeleccionadaId = null;
    this.cursosDelGrado = []; 
    this.cursosSeleccionadosParaAsignar = [];
  }

  ObtenerDocente() {
    if (!this.docenteEncontrado.dni) return;
    this.docenteService.getByDni(this.docenteEncontrado.dni).subscribe({
      next: (data) => {
        this.docenteEncontrado = {
          id: data.id, dni: data.dni,
          nombreCompleto: `${data.nombres} ${data.apellidos}`.trim(),
          esActivo: data.esActivo,
          horasAsignadas: data.horasAsignadas,
          horasRestantes: data.horasRestantes
        };
      },
      error: () => this.toastService.error("Docente no encontrado")
    });
  }

  obtenerGrados() { this.gradoService.getAll().subscribe(data => this.listaGrados = data); }
  obtenerSecciones() { this.seccionService.getAllSeccion().subscribe(data => this.listaSecciones = data); }
  obtenerPeriodo() { this.periodoService.getPeriodoActivo().subscribe(data => this.periodoActivo = data); }

  mostrarDocentesAsignados() {
    this.asignacionService.getAll(this.paginaActual, this.cantidadPorPagina).subscribe(data => {
      this.listaDocentes = data.items.map((d: any) => ({
        ...d, textEstado: d.estado ? 'Activo' : 'Inactivo',
        iniciales: this.getIciales(d.nombreDocente)
      }));
      this.listaFiltrada = [...this.listaDocentes];
      this.totalPaginas = data.totalPaginas;
      this.totalRegistros = data.totalRegistros;
    });
  }

  cambiarPagina(n: number) { 
    this.paginaActual = n; 
    this.mostrarDocentesAsignados(); 
  }

  getIciales(n: string): string { return n ? n.split(/\s+/).map(p => p[0]).join('').toUpperCase().substring(0, 2) : '??'; }

  eliminar(id: number) {
    this.toastService.confirmar("Eliminar", "¿Seguro?").then(r => {
      if (r.isConfirmed) this.asignacionService.delete(id).subscribe(() => this.mostrarDocentesAsignados());
    });
  }

  cursosFiltrados() {
    if (this.isAulaSelected) {
      this.listaFiltrada = [...this.listaDocentes];
      this.isAulaSelected = false;
    } else {
      if (!this.gradoId || !this.seccionId) return;
      this.asignacionService.getByGradoSeccion(this.gradoId, this.seccionId).subscribe(data => {
        this.listaFiltrada = data.map((d: any) => ({
          ...d, textEstado: d.estado ? 'Activo' : 'Inactivo', iniciales: this.getIciales(d.nombreDocente)
        }));
        this.isAulaSelected = true;
      });
    }
  }
}