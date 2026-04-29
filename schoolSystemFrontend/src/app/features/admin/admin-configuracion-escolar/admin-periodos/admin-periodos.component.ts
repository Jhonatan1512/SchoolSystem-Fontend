import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';

@Component({
  selector: 'app-tabla-periodos', 
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-periodos.component.html',
  styleUrl: './admin-periodos.component.css'
})
export class AdminPeriodosComponent implements OnInit {
  private periodoService = inject(PeriodoService);
  private toastServie = inject(NotificationServiceService);
  
  listaPeriodos: any[] = [];
  isModalOpen: boolean = false;
  editMode: boolean = false;

  idSelecionado: number = 1;

  nuevoPeriodo: any = {
    id: 0,
    nombre: '',
    fechaInicio: '',
    fechaCierre: '',
    estadoActivo: true
  };

  ngOnInit() {
    this.obtenerPeriodos();
  }

  obtenerPeriodos() {
    this.periodoService.getPeriodoAll().subscribe({
      next: (data) => {
        this.listaPeriodos = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  
  abrirModal(periodo?: any) {
    if (periodo) {
      this.nuevoPeriodo = { 
        ...periodo,
        fechaInicio: this.formatDate(periodo.fechaInicio),
        fechaCierre: this.formatDate(periodo.fechaCierre) 
      };
      this.editMode = true;
      this.idSelecionado = periodo.id
    } else {
      this.limpiarForm();
      this.editMode = false;
      this.idSelecionado = 0;
    }
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }
 
  guardarPeriodo() {
    if(
      !this.nuevoPeriodo.nombre || 
      !this.nuevoPeriodo.fechaInicio ||
      !this.nuevoPeriodo.fechaCierre || 
      this.nuevoPeriodo.estadoActivo === null || 
      this.nuevoPeriodo.estadoActivo === undefined
    ){
      this.toastServie.warning("Todos los campos son obligatorios");
      return;
    }

    if (this.editMode) {
      this.periodoService.update(this.nuevoPeriodo, this.idSelecionado).subscribe({
        next: (data) => {
          this.toastServie.succes("Registro Actualizado");
          this.obtenerPeriodos();
          this.cerrarModal(); 
        },
        error: () => {
          this.toastServie.error("Error al actualizar datos");
        }
      });
    } else {
      this.periodoService.create(this.nuevoPeriodo).subscribe({
        next: () => {
          this.toastServie.succes("Periodo Creado");
          this.obtenerPeriodos();
          this.cerrarModal(); 
        },
        error: (err) => {
          this.toastServie.error("Error al crear periodo");
        }
      });
    }
  }

  limpiarForm() {
    this.nuevoPeriodo = { id: 0, nombre: '', fechaInicio: '', fechaCierre: '', estadoActivo: true };
  }

  eliminarPeriodo(id: number){
    this.toastServie.confirmar("Advertencia", "¿Estas seguro de eliminar este registro?")
    .then((result) => {
      if(result.isConfirmed){
        this.periodoService.delete(id).subscribe({
          next: () => {
            this.toastServie.succes("Registro eliminado");
            this.obtenerPeriodos();
          },
          error: () => {
            this.toastServie.error("Error al eliminar registro");
          }
        });
      }
    });
  }
}