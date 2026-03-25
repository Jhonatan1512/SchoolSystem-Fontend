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

  listaCursos: any[] = [];
  listaGrados: any[] = [];

  nuevoCursoComptencias: any = {
    nombre: '',
    gradoId: 0,
    competencias: []
  };

  competeciaInput: string = '';

  ngOnInit() { 
    this.obtenerCursos();     
    this.mostrarGrado();
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
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

  obtenerCursos(){
    this.cursoService.getAll().subscribe({
      next: (data) => {
        this.listaCursos = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  verCompetencias(curso: any){
    this.router.navigate(['admin/cursos/competencias', curso.id], {
      state: {curso: curso}
    });
  }

  agregarCursoComptencias(){
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
    })
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

    //console.log("competencia agregada", nuevaComp);
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
