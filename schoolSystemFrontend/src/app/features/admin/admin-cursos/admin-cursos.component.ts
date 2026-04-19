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
    competencias: []
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
        //console.log(data);
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
    if(!this.nuevoCursoComptencias.nombre || !this.nuevoCursoComptencias.gradoId){
      this.toastService.warning("Todos los campos son obligatorios");
      this.cerrarModal();
      return;
    }

    this.nuevoCursoComptencias.gradoId = Number(this.nuevoCursoComptencias.gradoId);
    this.cursoService.create(this.nuevoCursoComptencias).subscribe({
      next: () => {
        this.toastService.succes("Curso y competencias creados");
        this.obtenerCursos();
        this.cerrarModal();
        this.limpiardatos();
      },
      error: () => {
        this.toastService.error("Error al crear el curso");
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

  limpiardatos(){
    this.nuevoCursoComptencias.nombre = '';
    this.nuevoCursoComptencias.gradoId = '';
    this.nuevoCursoComptencias.competencias = [];
    this.competeciaInput = '';
  }  
}
