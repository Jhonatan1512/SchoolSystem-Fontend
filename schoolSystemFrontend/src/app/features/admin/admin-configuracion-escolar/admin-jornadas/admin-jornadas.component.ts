import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JornadaService } from '../../../../core/services/jornada.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';
import { GradoServiceService } from '../../../../core/services/grado-service.service';
import { CursosService } from '../../../../core/services/cursos.service';

@Component({
  selector: 'app-admin-jornadas',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-jornadas.component.html',
  styleUrl: './admin-jornadas.component.css'
})
export class AdminJornadasComponent implements OnInit{
  private jornadaService = inject(JornadaService);
  private toastService = inject(NotificationServiceService);
  private gradoService = inject(GradoServiceService);
  private cursoService = inject(CursosService);

  listaCompleta: any[] = [];
  listaGrados: any[] = [];
  listaCursos: any[] = [];
  gradoSeleccionadoId: number = 0;

  nombrePeriodo: string = '';
  periodoActivoId: number = 0;

  public paginaActual: number = 1;
  public totalPaginas: number = 0;
  public totalRegistros: number = 0;
  public cantidadPorPagina: number = 11;

  isModelOpen: boolean = false;

  cursosSeleccionados: number[] = [];

  nuevoPlan = {
    jornada: 0,
    horasSemanales: 0,
    horasMaximasPorDia: 0,
    duracionBloque: 0
  };

  ngOnInit() {
    this.cargardatos();
    this.obetenerGrado();
  }

  abrirModal(){
    this.isModelOpen = true;
  }

  cerrarModal(){
    this.isModelOpen = false;   
    this.gradoSeleccionadoId = 0; 
  }

  obtenerCursos(){
    this.cursoService.getByGrado(this.gradoSeleccionadoId).subscribe({
      next: (data) => {
        this.listaCursos = data;
        this.cursosSeleccionados = [];
        
      }
    });
  }

  toggleCurso(event: any, cursoId: number){
    if(event.target.checked){
      this.cursosSeleccionados.push(cursoId);
    } else {
      this.cursosSeleccionados = this.cursosSeleccionados.filter(id => id !=cursoId);
    }
  }

  obetenerGrado(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaGrados = data;
        if (data && data.length > 0) {
          this.gradoSeleccionadoId = data.id;
        }
      }
    });
  }

  cargardatos(){
    this.jornadaService.getAll(this.paginaActual, this.cantidadPorPagina).subscribe({
      next: (data) => {
        this.listaCompleta = data.items;
        this.totalPaginas = data.totalPaginas;
        this.totalRegistros = data.totalRegistros;
        this.nombrePeriodo = data.items[0].nombrePeriodo; 
        this.periodoActivoId = data.items[0].periodoId;
      }
    });
  }

  registrarPal(){
    const body = {
      CursosId: this.cursosSeleccionados,
      jornada: Number(this.nuevoPlan.jornada),
      horasSemanales: Number(this.nuevoPlan.horasSemanales),
      horasMaximasPorDia: Number(this.nuevoPlan.horasMaximasPorDia),
      duracionBloque: Number(this.nuevoPlan.duracionBloque)
    }

    this.jornadaService.create(body).subscribe({
      next: () => {
        this.toastService.succes("Jornada asignada al curso");
        this.cargardatos();
        this.cerrarModal();
        this.limpiarDatos();
      },
      error: (error) => {
        this.toastService.error("Error al asignar jornada");
        this.limpiarDatos();
        this.cerrarModal();
        console.log(error);
      }
    });
  }

  limpiarDatos() {
    this.nuevoPlan.duracionBloque = 0;
    this.nuevoPlan.horasMaximasPorDia = 0;
    this.nuevoPlan.horasSemanales = 0;
    this.nuevoPlan.jornada = 0;
  }
} 
