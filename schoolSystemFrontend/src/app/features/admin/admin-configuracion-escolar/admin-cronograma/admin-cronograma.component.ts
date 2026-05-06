import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CronogramaService } from '../../../../core/services/cronograma.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';
import { GradoServiceService } from '../../../../core/services/grado-service.service';
import { PeriodoService } from '../../../../core/services/periodo.service';

@Component({
  selector: 'app-admin-cronograma',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cronograma.component.html',
  styleUrl: './admin-cronograma.component.css'
})
export class AdminCronogramaComponent implements OnInit {

  private cronogramaService = inject(CronogramaService);
  private gradoService = inject(GradoServiceService);
  private toastService = inject(NotificationServiceService);
  private periodoService = inject(PeriodoService);
 
  dataCronograma: any[] = []; 
  isModalOpe: boolean = false; 
  periodoActivoId: number = 0;
  nombrePeriodo: string = '';

  listaGrados: any[] = [];
  gradoId: number = 0;
  estadoCronograma: boolean = false;

  isEditeMode: boolean = false;
  idRegistro: Number = 0;

  nuevoCronograma = {
    periodoId: 0,
    gradoId: 0,
    fechaHoraInicio: '',
    fechaHoraCierre: ''
  }
 
  ngOnInit() {    
    this.cargarData();
    this.periodActivo(); 
    this.grados();
  } 

  cargarData(){
    this.cronogramaService.getAll().subscribe({
      next: (data) => {
        this.dataCronograma = data;
      }
    });
  }

  periodActivo(){
    this.periodoService.getPeriodoActivo().subscribe({
      next: (data) => {
        this.nombrePeriodo = data.nombre; 
        this.periodoActivoId = data.id;
      }
    });
  }

  grados() {
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaGrados = data;
      }
    });
  }

  agregarCronograma(){
    const ahora = new Date();
    const inicio = new Date(this.nuevoCronograma.fechaHoraInicio);
    const cierre = new Date(this.nuevoCronograma.fechaHoraCierre);

    if(ahora > cierre){
      this.estadoCronograma = false;
    } else if(ahora > inicio && cierre > ahora){
      this.estadoCronograma = true;
    } else if(cierre > ahora) {
      this.estadoCronograma = false
    }

    if(this.isEditeMode){
      if(!this.nuevoCronograma.fechaHoraInicio || !this.nuevoCronograma.fechaHoraCierre){
        this.toastService.warning("Todos los campos son obligatorios");
        this.cerrarModal();
        return;
      }
      const nuevasFechas = {
        nuevaFechaHoraInicio: this.nuevoCronograma.fechaHoraInicio,
        nuevaFechaHoraCierre: this.nuevoCronograma.fechaHoraCierre,
      }

      const id = Number(this.idRegistro);

      this.cronogramaService.update(id, nuevasFechas).subscribe({
        next: () => {
          this.toastService.succes("Fechas actualizadas");
          this.cargarData();
          this.cerrarModal();
          this.limpiarDatos();
        },
        error: (err) => {
          const errorMesage = err.error || "Error al crear cronograma"
          this.toastService.error(errorMesage);
          this.cerrarModal();
          this.limpiarDatos();
        }
      });
    } else {
      if(!this.nuevoCronograma.fechaHoraInicio || !this.nuevoCronograma.fechaHoraCierre || !this.gradoId){
        this.toastService.warning("Todos los campos son obligatorios");
        this.cerrarModal();
        return;
      }
      
      const body = {
        periodoId: Number(this.periodoActivoId),
        gradoId: Number(this.gradoId),
        fechaHoraInicio: this.nuevoCronograma.fechaHoraInicio,
        fechaHoraCierre: this.nuevoCronograma.fechaHoraCierre,
        estadoActivo: this.estadoCronograma
      }

      this.cronogramaService.create(body).subscribe({
        next: () => {
          this.toastService.succes("Cronograma creado");
          this.cargarData();
          this.cerrarModal();
          this.limpiarDatos();
        },
        error: (err) => {
          const errorMesage = err.error || "Error al crear cronograma"
          this.toastService.error(errorMesage);
          this.cerrarModal();
          this.limpiarDatos();
        }
      });
    }
  }

  esFututro(fecha: string): boolean{
    return new Date(fecha) > new Date();
  }

  esPasado(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }

  abrirModal(registro?: any){
    if(registro){
      this.nuevoCronograma = {
        ...registro,
      }
      this.idRegistro = registro.id;
      this.isEditeMode = true;
      this.isModalOpe = true;
    } else {
      this.isEditeMode = false;
      this.limpiarDatos();
    }
    this.isModalOpe = true;
  }

  cerrarModal() {
    this.isModalOpe = false; 
  }

  limpiarDatos(){
    this.nuevoCronograma.fechaHoraCierre = '';
    this.nuevoCronograma.fechaHoraInicio = '';
    this.nuevoCronograma.gradoId = 0;
    this.nuevoCronograma.periodoId = 0;
  }

}
