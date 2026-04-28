import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../core/services/horarios.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';

@Component({
  selector: 'app-admin-horarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-horarios.component.html',
  styleUrl: './admin-horarios.component.css'
})
export class AdminHorariosComponent implements OnInit {
  private horarioService = inject(HorariosService);
  private gradoService = inject(GradoServiceService);
  private seccionService = inject(SeccionServiceService);

  gradoId: number = 0;
  seccionId: number = 0;

  horarioData: any[] = []; 
  isEditing: boolean = false;

  gradoData: any[] = [];
  seccionData: any[] = [];

  ngOnInit() { 
    this.cargarHorarios();    
     this.obtenerGrado();
     this.obtenerSecciones();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  cargarHorarios(){
    this.horarioService.getByGradoSeccion(this.gradoId, this.seccionId).subscribe({
      next: (data) => {
        this.horarioData = data;
      }
    });
  }

  obtenerGrado() {
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.gradoData = data;
      }
    });
  }

  obtenerSecciones(){
    this.seccionService.getAllSeccion().subscribe({
      next: (data) => {
        this.seccionData = data;
      }
    });
  }

  parseContent(data: string) {
    if (!data || data === '---') return { curso: '---', docente: '' };
    const partes = data.split('\n');
    return {
      curso: partes[0],
      docente: partes[1] ? partes[1].replace('(', '').replace(')', '') : ''
    };
  }

  getCursoClass(data: string): string {
    if (!data || data === '---') return 'default';
    
    const curso = data.toLowerCase();

    if (curso.includes('matem')) return 'math';
    if (curso.includes('comunic')) return 'comunicacion';
    if (curso.includes('arte')) return 'arte';
    if (curso.includes('ingl')) return 'ingles';
    if (curso.includes('sociales')) return 'sociales';
    if (curso.includes('desarrollo') || curso.includes('civica') || curso.includes('dpcc')) return 'dpcc';
    if (curso.includes('física')) return 'fisica';
    if (curso.includes('religi')) return 'religion';
    if (curso.includes('tecnolo') || curso.includes('ciencia')) return 'ciencia';
    if (curso.includes('trabajo') || curso.includes('ept')) return 'ept';
    if (curso.includes('tutor')) return 'tutoria';

    return 'default';
  }

}
