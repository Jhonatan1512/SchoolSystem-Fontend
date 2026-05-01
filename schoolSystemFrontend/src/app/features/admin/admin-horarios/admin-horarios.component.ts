import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../core/services/horarios.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { SeccionServiceService } from '../../../core/services/seccion-service.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  private toastService = inject(NotificationServiceService);

  gradoId: number = 0;
  seccionId: number = 0;

  horarioData: any[] = []; 
  isEditing: boolean = false;

  gradoData: any[] = [];
  seccionData: any[] = [];

  showModal: boolean = false;
  isGenerating: boolean = false;
  generationResult: any = null;
  periodoActualId: number = 1; 
   
  ngOnInit() { 
     this.obtenerGrado();
     this.obtenerSecciones();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
 
  cargarHorarios(){
    if(this.gradoId === 0 || this.seccionId === 0) return; 
    
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

  abrirModalGeneracion() {
    this.showModal = true;
    this.isGenerating = true;
    this.generationResult = null;

    this.horarioService.generar(this.periodoActualId).subscribe({
      next: (result) => {
        this.isGenerating = false;
        this.generationResult = result;
        if (this.gradoId !== 0 && this.seccionId !== 0) {
          this.cargarHorarios();
        }
      },
      error: (err) => {
        this.isGenerating = false;
        this.generationResult = {
          exito: false,
          mensaje: "Ocurrió un error de conexión al generar los horarios.",
          advertencias: []
        };
        console.error(err);
      }
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.generationResult = null;
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

  descargarHorarios(){
    if (!this.horarioData || this.horarioData.length === 0) {
      this.toastService.warning("Por favor, primero carga un horario para poder descargarlo.");
      return;
    }
 
    const element = document.getElementById('horario-export');
    if (!element) return;

    const gradoNombre = this.gradoData.find(g => g.id == this.gradoId)?.nombre || 'Grado';
    const seccionNombre = this.seccionData.find(s => s.id == this.seccionId)?.nombre || 'Seccion';
    
    const wasEditing = this.isEditing;
    this.isEditing = false; 

    html2canvas(element, { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: '#ffffff' 
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4'); 
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.setFontSize(16);
      pdf.text(`Horario Académico - ${gradoNombre} ${seccionNombre}`, 14, 15);

      pdf.addImage(imgData, 'PNG', 10, 22, pdfWidth - 20, pdfHeight - 20);
      
      pdf.save(`Horario_${gradoNombre}_${seccionNombre}.pdf`);

      this.isEditing = wasEditing;
    });
  }
}