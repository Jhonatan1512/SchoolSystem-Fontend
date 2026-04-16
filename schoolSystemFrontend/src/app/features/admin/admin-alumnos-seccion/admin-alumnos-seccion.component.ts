import { Component, inject, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-admin-alumnos-seccion',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-alumnos-seccion.component.html',
  styleUrl: './admin-alumnos-seccion.component.css'
}) 
export class AdminAlumnosSeccionComponent implements OnInit{
  private toastServics = inject(NotificationServiceService);
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
    });
  }

  obtenerSecciones(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.listaSecciones = data;
      },
    error: (err) => {
      console.log(err);
    }
    });
  }

  descargarData(){
    if(this.dataAlumnos.length === 0){
      this.toastServics.warning("No hay Datos para exportar");
      return;
    }

   const dataExportar = this.dataAlumnos.map(alumno => {
    let fechaFormateada = '';
    if (alumno.fechaNacimiento) {
      const date = new Date(alumno.fechaNacimiento);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      fechaFormateada = `${day}-${month}-${year}`;
    }

    return {
      'Apellidos y Nombres': `${alumno.apellidos} ${alumno.nombre}`,
      'DNI': alumno.dni,
      'Grado Sección': alumno.aula,
      'Correo Electrónico': alumno.email,
      'Situación': alumno.estado,
      'Fecha de Nacimiento': fechaFormateada, 
      'Sexo': alumno.sexo
    };
  });

    const worksheet = XLSX.utils.json_to_sheet(dataExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');

    const fecha = new Date().toISOString().slice(0,10);
    XLSX.writeFile(workbook, `Reporte_Alumnos_${fecha}.xlsx`)

    this.toastServics.succes("Archivo generado");
  }
}
