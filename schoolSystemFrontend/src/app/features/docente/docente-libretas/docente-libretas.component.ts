import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../../core/services/docente.service';
import { RouterLink } from "@angular/router";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-docente-libretas',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './docente-libretas.component.html',
  styleUrl: './docente-libretas.component.css'
})
export class DocenteLibretasComponent implements OnInit { 
  private docenteService = inject(DocenteService);

  listaAlumnos: any[] = [];
  cargando: boolean = false;

  ngOnInit() {
    this.obtenerAlumnosTutoria();
  }

  obtenerAlumnosTutoria() {
    
    this.docenteService.getAlumnosTutoria().subscribe({
      next: (res) => {
        this.listaAlumnos = res.data ? res.data : res;
      }
    });
  }

  decargarLibreta(alumnoId: number) {
    const infoAlumno = this.listaAlumnos.find(a => a.alumnoId === alumnoId);
    
    if (!infoAlumno) return;

    this.cargando = true;

    this.docenteService.getLibreta(alumnoId).subscribe({
      next: (data) => {
        this.generarPDF(data, infoAlumno);
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al obtener notas", err);
        this.cargando = false;
      }
    });
  }

  private generarPDF(dataLibreta: any, alumno: any) {
    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 40;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE PROGRESO DE LAS COMPETENCIAS DEL ESTUDIANTE', pageWidth / 2, 40, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`DRE: CAJAMARCA`, margin, 70);
    doc.text(`UGEL: 01 - CAJAMRCA`, margin + 150, 70);
    doc.text(`Nivel: SECUNDARIA`, margin + 350, 70);

    doc.rect(margin, 80, pageWidth - (margin * 2), 45); 
    doc.setFont('helvetica', 'bold');
    doc.text(`Estudiante: ${alumno.nombreCompelto.toUpperCase()}`, margin + 10, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(`Código Est.: ${alumno.dni || '---------'}`, margin + 10, 110);
    doc.text(`Grado: ${alumno.grado}`, margin + 180, 110);
    doc.text(`Sección: ${alumno.seccion}`, margin + 350, 110);

    const headerRow = ['ÁREA CURRICULAR', 'COMPETENCIAS', ...dataLibreta.columnaTrimestres];
    const body: any[] = [];

    dataLibreta.cursos.forEach((curso: any) => {
      const numCompetencias = curso.competencias.length;

      curso.competencias.forEach((comp: any, index: number) => {
        const row = [];

        if (index === 0) {
          row.push({
            content: curso.nombrecurso.toUpperCase(),
            rowSpan: numCompetencias, 
            styles: { 
              valign: 'middle', 
              halign: 'center', 
              fillColor: [245, 245, 245], 
              fontStyle: 'bold',
              cellWidth: 100 
            }
          });
        }

        row.push({
            content: comp.nombreCompetencia,
            styles: { cellWidth: 200 }
        });

        comp.notasPorTrimestre.forEach((nota: any) => {
          row.push({
            content: nota || '-',
            styles: { halign: 'center' }
          });
        });

        body.push(row);
      });
    });

    autoTable(doc, {
      startY: 140,
      head: [headerRow],
      body: body,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 4,
        lineColor: [80, 80, 80],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 1
      },
      columnStyles: {
        0: { fontStyle: 'bold' }, 
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 30;
    
    autoTable(doc, {
        startY: finalY,
        margin: { right: 300 },
        head: [['Escala', 'Descripción']],
        body: [
            ['AD', 'Logro Destacado'],
            ['A', 'Logro Previsto'],
            ['B', 'En Proceso'],
            ['C', 'En Inicio']
        ],
        theme: 'grid',
        styles: { fontSize: 6.5, cellPadding: 2 }
    });

    const firmaY = finalY + 80;
    doc.line(margin + 50, firmaY, margin + 180, firmaY);
    doc.text('Firma del Docente / Tutor', margin + 65, firmaY + 12);
    doc.line(pageWidth - 220, firmaY, pageWidth - margin - 50, firmaY);
    doc.text('Firma del Director(a)', pageWidth - 180, firmaY + 12);

    doc.save(`Informe_Progreso_${alumno.nombreCompelto.replace(/\s/g, '_')}.pdf`);
  }
}