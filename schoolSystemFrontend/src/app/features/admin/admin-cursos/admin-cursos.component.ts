import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { CursosService } from '../../../core/services/cursos.service';
import { Router } from '@angular/router';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-cursos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.css'
})

export class AdminCursosComponent implements OnInit{
  private cursoService = inject(CursosService);
  private gradoService = inject(GradoServiceService);
  private toastService = inject(NotificationServiceService);
  private router = inject(Router);

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  isModalEditOpen: boolean = false;

  listaCursos: any[] = [];
  listaGrados: any[] = [];

  competeciaInput: string = '';

  gradoSeleccionado: number = 0;

  idCursoEdit: number = 0;

  public paginaActual: number = 1;
  public totalPaginas: number = 0;
  public totalRegistros: number = 0;
  public cantidadPorPagina: number = 11;

  nuevoCursoComptencias: any = {
    nombre: '',
    gradoId: 0,
    nombreAula: '',
    prioridad: 0,
    competencias: [],
    planEstudios: [
      {
        horasSemanales: null,
        horasMaximasPorDia: null,
        duracionBloque: 0,
        jornada: null
    }
    ]
  };

  ngOnInit() { 
    this.obtenerCursos();     
    this.mostrarGrado();
  }

  abrirModal(){
    this.isModalOpen = true;
    this.limpiardatos();
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  abrirModalEditar(curso?:any){
    if(curso){
      this.nuevoCursoComptencias = {
        ...curso,
      } 
      this.isModalEditOpen = true;
      this.idCursoEdit = curso.id;
    } else {
      this.limpiardatos();
      this.isModalEditOpen = false;
    }
    this.isModalEditOpen = true;
  }

  mostrarGrado(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaGrados = data;
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  cargarCursos(){
    this.cursoService.getByGrado(this.gradoSeleccionado).subscribe({
      next: (data) => {
        this.listaCursos = data;
      },
      error: () => {
        this.toastService.error("Error al cargar cursos del grado seleccionado");
      }
    });
  }

  guardarNombreCurso() {
    if(!this.nuevoCursoComptencias.nombre){
      this.toastService.warning("El nombre del curso es obligatorio");
      return;
    }

    const data = {
      nombre: this.nuevoCursoComptencias.nombre
    }

    this.cursoService.updateCurso(this.idCursoEdit, data).subscribe({
      next: () => {
        this.toastService.succes("Datos del curso Actualizados");
        this.isModalEditOpen = false;
        this.nuevoCursoComptencias.nombre = '';
        this.obtenerCursos();
      },
      error: () => {
        this.toastService.error("No se puedo modificar los datos del curso");
        this.isModalEditOpen = false;
      }
    });
  }
 
  obtenerCursos(){
    this.cursoService.getAll(this.paginaActual, this.cantidadPorPagina).subscribe({
      next: (data) => {
        this.listaCursos = data.items;
        this.totalPaginas = data.totalPaginas;
        this.totalRegistros = data.totalRegistros;
      },
      error: (err) => {
        console.log(err);
      }
    });
  } 

  cambiarPagina(nueva: number){
    this.paginaActual = nueva;
    this.obtenerCursos();
  }

  verCompetencias(curso: any){
    this.router.navigate(['admin/cursos/competencias', curso.id], {
      state: {curso: curso}
    });
  }

  agregarCursoComptencias(){
    const curso = this.nuevoCursoComptencias;
    const plan = curso.planEstudios[0];

    if (!curso.nombre || !curso.gradoId || !curso.prioridad || 
        !plan.jornada || !plan.horasSemanales || !plan.horasMaximasPorDia) {

      this.toastService.warning("Todos los campos del curso y del plan son obligatorios");
      this.cerrarModal();
      return;
    }

    if (curso.competencias.length === 0) {
      this.toastService.warning("Debe agregar al menos una competencia");
      return;
    }

    const body = {
      nombre: this.nuevoCursoComptencias.nombre,
      gradoId: Number(this.nuevoCursoComptencias.gradoId),
      prioridad: Number(this.nuevoCursoComptencias.prioridad),
      
      planEstudios: this.nuevoCursoComptencias.planEstudios.map((p: any) => ({
        jornada: Number(p.jornada),
        horasSemanales: Number(p.horasSemanales),
        horasMaximasPorDia: Number(p.horasMaximasPorDia),
        duracionBloque: Number(p.duracionBloque)
      })),

      competencias: this.nuevoCursoComptencias.competencias
    };

    this.cursoService.create(body).subscribe({
      next: () => {
        this.toastService.succes("Curso y competencias creados");
        this.obtenerCursos();
        this.cerrarModal();
        this.limpiardatos();
      },
      error: (err) => {
        let mensajeError = 'Error';
        if(err.error){
          if(typeof err.error === 'object' && err.error.mesaje){
            mensajeError = err.error.mesaje;
          } else if(typeof err.error === 'string'){
            mensajeError = err.error;
          }
        }
        this.toastService.error(mensajeError);
        this.cerrarModal();
      }
    });
  }

  agregarCompetencia(){
    if(this.competeciaInput.trim() === ''){
      this.toastService.warning("Por favor, escribe una competencia");
      return;
    }

    const nuevaComp = {
      id: 0,
      nombre: this.competeciaInput.trim()
    };

    this.nuevoCursoComptencias.competencias.push(nuevaComp);
    this.competeciaInput = '';
  }
 
  quitarCompetencia(index: number){
    this.nuevoCursoComptencias.competencias.splice(indexedDB, 1);
  } 

  limpiardatos() {
    this.nuevoCursoComptencias = {
      nombre: '',
      gradoId: null,
      prioridad: 1, 
      competencias: [],
      planEstudios: [
        {
          jornada: null,
          horasSemanales: null,
          horasMaximasPorDia: null,
          duracionBloque: null
        }
      ]
    };
    this.competeciaInput = '';
  }  

  eliminarCurso(id:number){
    this.toastService.confirmar("Advertencia","¿Estas seguro de eliminar este registro?")
      .then((result) => {
        if(result.isConfirmed){
          this.cursoService.delete(id).subscribe({
            next: () => {
              this.toastService.succes("Registro de curso eliminado");
              this.obtenerCursos();
            },
            error: () => {
              this.toastService.error("Error el eliminar registro");
            }
          });
        }
      });
  }
}
