import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrimestreService } from '../../../../core/services/trimestre.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';
import { PeriodoService } from '../../../../core/services/periodo.service';

@Component({
  selector: 'app-admin-trimestre', 
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-trimestre.component.html',
  styleUrl: './admin-trimestre.component.css'
})

export class AdminTrimestreComponent implements OnInit{
  private trimestreService = inject(TrimestreService);
  private periodoService = inject(PeriodoService)
  private toastService = inject(NotificationServiceService);

  periodoNombreActual: string = "Cargando...";
  idPeriodo: number = 0;

  isDateModalOpen= false;
  trimestreSeleccionado: any = null;

  listaTrimestres: any[] = [];

  isModalOpen = false;
  editMode: boolean = false;

  idTrimestreSeleccionado: number = 0;
  
  nuevoTrimestre = {
    nombre: '',
    fechaInicio: '',
    fechaCierre: '',
    estadoActivo: true
  };

  periodoActivo = {
    id: '',
    nombre: ''
  }

  ngOnInit() {
    this.obtenerTrimestres();
    this.cargarPeriodActivo();
  }

  cargarPeriodActivo(){
    this.periodoService.getActivo().subscribe({
      next: (data) => {
        this.periodoActivo = data;
        if(data){
          this.periodoNombreActual = data.nombre;
          this.idPeriodo = data.id;
        }
      },
      error: () => {
      }
    });
  }

  obtenerTrimestres(){
    this.trimestreService.getAll().subscribe({
      next: (data) => {
        this.listaTrimestres = data;
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  guardarTrimestre(){
    if(this.editMode){
      this.trimestreService.updateTrimestre(this.idTrimestreSeleccionado, this.nuevoTrimestre).subscribe({
        next: () => {
          this.toastService.succes("Datos del trimestre actualizados");
          this.cerrarModal();
          this.obtenerTrimestres();
          this.limpiarCampos();
        },
        error: () => {
          this.toastService.error("Error al modificar datos");
          this.limpiarCampos();
          this.cerrarModal();
        }
      })
    } else {
      const datos = {
        nombre: this.nuevoTrimestre.nombre,
        fechaInicio: this.nuevoTrimestre.fechaInicio,
        fechaCierre: this.nuevoTrimestre.fechaCierre,
        periodoAcademicoId: this.idPeriodo,
        estadoActivo: this.nuevoTrimestre.estadoActivo
      }

      // console.log(datos);

      this.trimestreService.create(datos).subscribe({
        next: () => {
          this.toastService.succes("Trimestre Registrado");
          this.cerrarModal();
          this.obtenerTrimestres();
          this.limpiarCampos();
        }, 
        error: (err) => {
          this.toastService.error("Error al registra trimestre");
          this.limpiarCampos;
          this.cerrarModal();
          console.log(err);
        }
      });
    }
  }

  actualizarFechaCierre(){
    if(!this.trimestreSeleccionado.fechaCierre) return;

    const nuevaFechaCierre = {
      id: this.trimestreSeleccionado.id,
      nuevaFechaCierre: this.trimestreSeleccionado.fechaCierre
    }

    this.trimestreService.updateDate(nuevaFechaCierre.id, nuevaFechaCierre).subscribe({
      next: () => {
        this.toastService.succes("Cambios guardados");
        this.cerrarModal();
        this.obtenerTrimestres();
        this.limpiarCampos();
      },
      error: (err) => {
        console.log(err);
        this.toastService.error("Error al modificar la fecha de cierre");
        this.cerrarModal();
        this.limpiarCampos();
      }
    });
  }

  eliminar(id: number){
    console.log("id a eliminar", id);
    this.toastService.confirmar("Advertencia","¿Estase Seguro de elimnar este Registro")
    .then((result) => {
      if (result.isConfirmed){
        this.trimestreService.delete(id).subscribe({
          next: () => {
            this.toastService.succes("Trimestre eliminado");
            this.obtenerTrimestres();
          },
          error: () => {
            this.toastService.error("Error al elimnar trimestre");
          }
        });
      }
    });
  }

  abrirModal(trimestre?: any) {
    if(trimestre){
      this.nuevoTrimestre = {
        ...trimestre,
        nombre: trimestre.nombre,
        fechaInicio: this.formatDate(trimestre.fechaInicio)};
        this.editMode = true;
        this.idTrimestreSeleccionado = trimestre.id;
    } else {      
      this.editMode = false;
      this.idTrimestreSeleccionado = 0;
      this.limpiarCampos();
    }    
    this.isModalOpen = true;
  }

  abrirModalFecha(trimestre: any){
    this.trimestreSeleccionado = {...trimestre};
    this.trimestreSeleccionado.fechaCierre = this.formatDate(trimestre.fechaCierre);
    this.isDateModalOpen = true;
  }

  private formatDate(date: any) {
    return new Date(date).toISOString().split('T')[0];
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.isDateModalOpen = false;
  }

  limpiarCampos(){
    this.nuevoTrimestre = {
      nombre: '',
      fechaInicio: '',
      fechaCierre: '',
      estadoActivo: true
    };
  }
}
