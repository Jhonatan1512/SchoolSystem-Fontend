import { Component, inject, OnInit } from '@angular/core';
import { CursosService } from '../../../../core/services/cursos.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompetenciasService } from '../../../../core/services/competencias.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-cursos-competencias',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-cursos-competencias.component.html',
  styleUrl: './admin-cursos-competencias.component.css'
})

export class AdminCursosCompetenciasComponent implements OnInit {
  private cursoService = inject(CursosService);
  private competenciaService = inject(CompetenciasService);
  private toastService = inject(NotificationServiceService);
  private route = inject(ActivatedRoute);
 
  cursoId: number = 0;

  listaComptencias: any[] = [];
  cursoInfo: any = null;

  isModalCrearComp: boolean = false;
  isEditMode: boolean = false;
  idCompetencia: number = 0;

  nuevaCompetencia = {
    nombre: '',
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.cursoId = idParam ? parseInt(idParam) : 0;

    const estadoNavegacion = history.state;
    if(estadoNavegacion && estadoNavegacion.curso){
      this.cursoInfo = estadoNavegacion.curso;
    }
 
    if(this.cursoId > 0){
      this.mostrarCompetencias();
    }
  }

  mostrarCompetencias(){
    this.cursoService.getById(this.cursoId).subscribe({
      next: (res: any) => {
        this.listaComptencias = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  guardarCompetencia(){
    if(!this.nuevaCompetencia.nombre){
      this.toastService.warning("Todos los campos son obligatorios");
      return;
    }  

    if(this.isEditMode){
      this.competenciaService.update(this.idCompetencia, this.nuevaCompetencia).subscribe({
        next: () => {
          this.toastService.succes("Datos de la competencia modificados");
          this.isModalCrearComp = false;
          this.mostrarCompetencias();
          this.limpiarDatos();
        },
        error: () => {
          this.toastService.error("Error al modificar datos de la competencia");
          this.isModalCrearComp = false;
          this.limpiarDatos();
        }
      });

    } else {
      const body = {
        nombre: this.nuevaCompetencia.nombre,
        cursoId: Number(this.cursoId)
      }
      this.competenciaService.create(body).subscribe({
        next: () => {
          this.toastService.succes("Competencia Creada");
          this.isModalCrearComp = false;
          this.mostrarCompetencias();
          this.limpiarDatos();
        },
        error: () => {
          this.toastService.error("Error al crear competencia");
          this.isModalCrearComp = false;
          this.limpiarDatos();
        }
      });  
    }
  }

  abrirModal(competencia?:any){
    if(competencia){
      this.nuevaCompetencia = {
        ...competencia,
        nombre: competencia.nombreCompetencia
      }
      this.idCompetencia = competencia.id;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.limpiarDatos();
    }
    this.isModalCrearComp = true;
  }
 
  eliminarCompetencia(id:number) {
    this.toastService.confirmar("Advertencia","¿Estas seguro de eliminar este registro?")
      .then((result) => {
        if(result.isConfirmed){
          this.competenciaService.delete(id).subscribe({
            next: () => {
              this.toastService.succes("Registro de competencia eliminado");
              this.mostrarCompetencias();
            },
            error: () => {
              this.toastService.error("Error al eliminar registro de competencia");
            }
          });
        }
      });
  }

  limpiarDatos(){
    this.nuevaCompetencia.nombre = '';
    this.cursoId = 0;
  }
}
