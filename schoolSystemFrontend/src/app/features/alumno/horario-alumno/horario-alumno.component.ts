import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoService } from '../../../core/services/alumno.service';
import { HorariosService } from '../../../core/services/horarios.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-horario-alumno',
  imports: [CommonModule, FormsModule],
  templateUrl: './horario-alumno.component.html',
  styleUrl: './horario-alumno.component.css'
})
export class HorarioAlumnoComponent implements OnInit{

  private alumnoService = inject(AlumnoService);
  private horarioService = inject(HorariosService);

  dataAlumno: any[] = [];
  horarioData: any[] = [];

  gradoId: number = 0;
  seccionId: number = 0;

  ngOnInit() {
    this.cargarInfoAlumno();
  }

  cargarInfoAlumno(){
    this.alumnoService.getPerfil().subscribe({
      next: (data) => {
        this.gradoId = data.gradoId;
        this.seccionId = data.seccionId;
        this.cargarHorario();
      }
    });
  }

  cargarHorario(){
    this.horarioService.getBylumno(this.gradoId, this.seccionId).subscribe({
      next: (dataHorario) => {
        this.horarioData = dataHorario;
      }
    });
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

  parseContent(data: string) {
    if (!data || data === '---') return { curso: '---', docente: '' };
    const partes = data.split('\n');
    return {
      curso: partes[0],  
      docente: partes[1] ? partes[1].replace('(', '').replace(')', '') : ''
    };
  } 
  
  async descargarHorarios() {
    if (!this.horarioData || this.horarioData.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mi Horario', {
      views: [{ showGridLines: false }] 
    });

    worksheet.columns = [
      { key: 'modulo', width: 16 },
      { key: 'lunes', width: 22 },
      { key: 'martes', width: 22 },
      { key: 'miercoles', width: 22 },
      { key: 'jueves', width: 22 },
      { key: 'viernes', width: 22 }
    ];

    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'HORARIO ACADÉMICO DEL ALUMNO';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1A202C' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const headerRow = worksheet.getRow(3);
    headerRow.values = ['MÓDULO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A7E92' } };
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const colorMap: any = {
      'math': { bg: 'FFFCEDED', font: 'FFBD1523' },         
      'comunicacion': { bg: 'FFE5EBFF', font: 'FF4B4EBD' }, 
      'arte': { bg: 'FFFAE6FF', font: 'FF9A209E' },        
      'ingles': { bg: 'FFFFFAC2', font: 'FF9E7F0B' },       
      'sociales': { bg: 'FFFCE4DC', font: 'FFC04925' },     
      'dpcc': { bg: 'FFFCEDF4', font: 'FF8C114F' },         
      'fisica': { bg: 'FFF4F6FA', font: 'FF2F3B52' },       
      'religion': { bg: 'FFFDF0E6', font: 'FFBD410B' },     
      'ciencia': { bg: 'FFE2FAE8', font: 'FF20873A' },      
      'ept': { bg: 'FFE6FCFC', font: 'FF117E8C' },          
      'tutoria': { bg: 'FFE6FAEB', font: 'FF177A33' },      
      'default': { bg: 'FFF8F9FA', font: 'FFADB5BD' }       
    };

    let currentRow = 4;

    this.horarioData.forEach(fila => {
      const row = worksheet.getRow(currentRow);
      row.height = 45; 

      if (!fila.esProductiva) {
        worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
        row.getCell(1).value = `${fila.bloque}\n${fila.rangoHora}`;
        row.getCell(2).value = `✦ RECREO ✦`;
        
        row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF5F5' } };
        row.getCell(2).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFC53030' } };
        row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
        
        row.getCell(1).value = `${fila.bloque.split(' ')[0]}\n${fila.rangoHora}`;
        
        dias.forEach((dia, index) => {
          const colIndex = index + 2; 
          const dataCruda = fila[dia];
          const parsed = this.parseContent(dataCruda);
          
          const cell = row.getCell(colIndex);
          
          if (parsed.curso !== '---') {
            cell.value = `${parsed.curso}\n(${parsed.docente})`;
            const cssClass = this.getCursoClass(dataCruda);
            const estilo = colorMap[cssClass] || colorMap['default'];
            
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: estilo.bg } };
            cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: estilo.font } };
          } else {
            cell.value = '---';
            cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FFADB5BD' } };
          }
        });
      }

      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        if (colNumber === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF4A5568' } };
        }
      });
      
      currentRow++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Mi_Horario_Escolar_${new Date().getTime()}.xlsx`);
  }
}
