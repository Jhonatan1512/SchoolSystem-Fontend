import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';

@Component({
  selector: 'app-admin-alumnos-seccion',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-alumnos-seccion.component.html',
  styleUrl: './admin-alumnos-seccion.component.css'
})
export class AdminAlumnosSeccionComponent implements OnInit{
  
  private adminService = inject(AdminService);
  private gradoService = inject(GradoServiceService);
  private seccionService = inject(SeccionServiceService);

  dataAlumnos: any[] = [];

  seccionId: number | null = null;
  gradoId: number | null = null;

  listaGrados: any[] = [];
  listaSecciones: any[] = [];

  nombreGradoSeleccion: string = '';
  nombreSeccionSelecionada: string = '';

  ngOnInit() {
      this.mostrarDetalle();
      this.obtenerGrados();
      this.obtenerSecciones();
  }

  mostrarDetalle(){
    if(this.gradoId && this.seccionId){
      const gradoEnc = this.listaGrados.find(g => g.id == this.gradoId);
      const seccionEnc = this.listaSecciones.find(g => g.id == this.seccionId);

      this.nombreGradoSeleccion = gradoEnc ? gradoEnc.nombre : '';
      this.nombreSeccionSelecionada = seccionEnc ? seccionEnc.nombre: '';
      this.adminService.obtenerPorSeccion(this.gradoId, this.seccionId).subscribe({
        next: (data) => {
          if(Array.isArray(data)){
            this.dataAlumnos = data;
          } else if (data && data.data && Array.isArray(data.data)){
            this.dataAlumnos = data.data;
          }else {
            this.dataAlumnos = [];
          }                  
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  obtenerGrados(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaGrados = data;
      },
    error: (err) => {
      console.log(err);
    }
    })
  }

  obtenerSecciones(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      },
    error: (err) => {
      console.log(err);
    }
    })
  }
}
