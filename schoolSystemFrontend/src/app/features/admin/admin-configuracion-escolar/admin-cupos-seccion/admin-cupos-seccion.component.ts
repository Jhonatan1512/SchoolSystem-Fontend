import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';
import { ConfiguracionCuposService } from '../../../../core/services/configuracion-cupos.service';
import { GradoServiceService } from '../../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../../core/services/seccion-service.service';

@Component({
  selector: 'app-admin-cupos-seccion',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cupos-seccion.component.html',
  styleUrl: './admin-cupos-seccion.component.css'
})
export class AdminCuposSeccionComponent implements OnInit{
  private configService = inject(ConfiguracionCuposService);
  private toastService = inject(NotificationServiceService);
  private gradoService = inject(GradoServiceService);
  private seccionService = inject(SeccionServiceService);

  isModalOpen: boolean = false;

  listaSecciones: any[] = [];
  listaCursos: any[] = [];

  idSeleccionado: number = 0;

  listaDetalles: any[] = []; 

  periodoAcademico: string = '';
  cuposObtenidos: number = 0;

  editMode: boolean = false;

  nuevaConfig = {
    gradoId: 0,
    seccionId: 0,
    capacidadMax: 0
  };

  ngOnInit() {
    this.mostrarCurso();
    this.obtenerDetallesSeccionGrado();
    this.obtenerSecciones();
  }

  abrirModal(data?:any){
    if(data){
      this.nuevaConfig = {
        ...data,
        capacidadMax: data.capacidad
      };
      this.idSeleccionado = data.id;
      this.cuposObtenidos = data.totalMatriculados;
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }

  mostrarCurso(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaCursos = data;
      }
    });
  }

  obtenerSecciones(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      }
    });
  }
 
  obtenerDetallesSeccionGrado(){
    this.configService.getAll().subscribe({
      next: (data) => {
        this.listaDetalles = Array.isArray(data) ? data : [data] ;
        if(Array.isArray(data) && data.length > 0){
          this.periodoAcademico = data[0].periodoAcademico;
        } else if(data && !Array.isArray(data)){
          this.periodoAcademico = data.periodoAcademico;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  crearConfiguracion(){ 
    if(!this.nuevaConfig.gradoId || !this.nuevaConfig.seccionId || !this.nuevaConfig.capacidadMax){
      this.toastService.warning("Todos lo campos son obligatorios");
      return;
    }  
      
    if (this.nuevaConfig.capacidadMax <= 0){
      this.toastService.warning("Los cupos deber ser mayores a '0'");
      return;
    }

    if(this.nuevaConfig.capacidadMax < this.cuposObtenidos){
      this.toastService.warning(`No se puede asignar ${this.nuevaConfig.capacidadMax} cupos, ya hay ${this.cuposObtenidos} alumnos matriculados`);
      return;
    }


    if(this.editMode){      
      this.configService.update(this.idSeleccionado, this.nuevaConfig).subscribe({
        next: () => {
          this.toastService.succes("Cupos para el grado y sección modificados");
          this.cerrarModal();
          this.obtenerDetallesSeccionGrado();
          this.limpiarCampos();
        },
        error: () => {
          this.toastService.error("Erro al modificar los cupos para este grado y sección");
          this.cerrarModal();
          this.limpiarCampos();
        }
      });
    } else {
      
      const gradoIdExiste = Number(this.nuevaConfig.gradoId);
      const seccionIdExiste = Number(this.nuevaConfig.seccionId);
      const cuposNegativos = Number(this.nuevaConfig.capacidadMax);

      const yaExiste = this.listaDetalles.some(item => 
        item.gradoId == gradoIdExiste && 
        item.seccionId == seccionIdExiste);

      if(yaExiste){
        this.toastService.warning("Este grado y sección ya tiene cupos definidos");
        return;
      }

      if(cuposNegativos <= 0){
        this.toastService.warning("La cantidad de cupos debe ser mayor a 0");
        return;
      }    

      const dataConfig = {
        gradoId: gradoIdExiste,
        seccionId: seccionIdExiste,
        capacidadMax: this.nuevaConfig.capacidadMax
      }

      this.configService.create(dataConfig).subscribe({
        next: () => {
          this.toastService.succes("Cupos asignados a esta sección");
          this.cerrarModal();
          this.obtenerDetallesSeccionGrado();
          this.limpiarCampos();
        },
        error: () => {
          this.toastService.error("Error el asignar cupos a la sección");
          this.cerrarModal();
          this.limpiarCampos();
        }
      });
    }    
  }

  eliminarCupos(id:number){
    this.toastService.confirmar("Advertencia","¿Estas seguro de eliminar este registro?")
    .then((result) => {
      if(result.isConfirmed){
        this.configService.delete(id).subscribe({
          next: () => {
            this.toastService.succes("Registro eliminado");
            this.obtenerDetallesSeccionGrado();
          },
          error: () => {
            this.toastService.error("Error al eliminar registro");
          }
        });
      }
    });
  }

  limpiarCampos(){
    this.nuevaConfig.gradoId = 0;
    this.nuevaConfig.seccionId = 0;
    this.nuevaConfig.capacidadMax = 0;
  }
}
