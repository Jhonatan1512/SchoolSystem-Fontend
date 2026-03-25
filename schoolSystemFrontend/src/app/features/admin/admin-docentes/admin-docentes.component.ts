import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocenteService } from '../../../core/services/docente.service';
import { FormsModule } from "@angular/forms";
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-docentes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-docentes.component.html',
  styleUrl: './admin-docentes.component.css'
})
export class AdminDocentesComponent implements OnInit{
  private docenteService = inject(DocenteService);
  private toastService = inject(NotificationServiceService);

  listaDocentes: any[] = [];

  isModalOpen: boolean = false;
  
  public nuevoDocente = {
    nombres: '',
    apellidos: '',
    dni: '',
    esActivo: true
  } 

  ngOnInit() {
    this.obtenerDocentes();
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  getInciales(nombres: string, apellidos: string): string {
    if(!nombres || !apellidos) return '??';

    const primerNombre = nombres.trim().split(/\s+/)[0];
    const incialNombre = primerNombre.charAt(0).toUpperCase();

    const primerApellido = apellidos.trim().split(/\s+/)[0];
    const inicalApellido = primerApellido.charAt(0).toUpperCase();

    return `${incialNombre}${inicalApellido}`;
  }

  obtenerDocentes() {
    this.docenteService.getAll().subscribe({
      next: (data) => {
        this.listaDocentes = data.map((docente: any) => ({
          ...docente,
          iniciales: this.getInciales(docente.nombres, docente.apellidos),
          estado: docente.esActivo ? 'Activo' : 'Inactivo',
        }));
      }, 
      error: (err) => {
        console.log(err);
      }
    });
  }

  crearDocente() {
    this.docenteService.agregarDocente(this.nuevoDocente).subscribe({
      next: (dataDocente) => {
        this.nuevoDocente = dataDocente;
        this.toastService.succes("Docente creado correctamente");
        this.cerrarModal();
        this.obtenerDocentes();
      },
      error: (err) => {
        this.toastService.error("Error al crear docente");
      }
    });
  }

}
 