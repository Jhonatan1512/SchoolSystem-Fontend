import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../core/services/horarios.service';
import { DocenteService } from '../../../core/services/docente.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({ 
  selector: 'app-horario-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario-docente.component.html',
  styleUrl: './horario-docente.component.css'
})
export class HorarioDocenteComponent implements OnInit {
  private horariosService = inject(HorariosService);
  private docenteService = inject(DocenteService);

  idDocente: number = 0;
  horarioData: any[] = []; 

  ngOnInit() {
    this.obtenerInformacionDocente();
  }

  obtenerInformacionDocente() {
    this.docenteService.getPerfil().subscribe({
      next: (data) => {
        this.idDocente = data.id;
        this.obetenerHorario(); 
      }
    });
  }

  obetenerHorario() {
    let id = Number(this.idDocente);
    this.horariosService.getByDocente(id).subscribe({
      next: (dataHorario) => {
        this.horarioData = dataHorario; 
      }
    }); 
  }

  extraerCurso(celda: string): string {
    if (!celda || celda === '---') return '-';
    return celda.split('(')[0].trim();
  }

  extraerAula(celda: string): string {
    if (!celda || celda === '---') return '';
    const partes = celda.split('(');
    return partes.length > 1 ? partes[1].replace(')', '').trim() : '';
  }

  extraerRango(rango: string): string {
    return rango ? rango.trim() : '';
  }

  obtenerClaseAula(celda: string): string {
    if (!celda || celda === '---') return 'card-vacio';
    
    const aula = this.extraerAula(celda).toUpperCase();
    if (!aula) return 'card-vacio';

    let hash = 0;
    for (let i = 0; i < aula.length; i++) {
      hash = aula.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const numColores = 11;
    const index = (Math.abs(hash) % numColores) + 1;
    
    return `color-${index}`;
  }

  async descargarExcelModerno() {
    if (!this.horarioData || this.horarioData.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Horario 2026', {
      views: [{ showGridLines: false }]  
    });

    worksheet.columns = [  
      { key: 'modulo', width: 15 },
      { key: 'lunes', width: 22 },
      { key: 'martes', width: 22 },
      { key: 'miercoles', width: 22 },
      { key: 'jueves', width: 22 },
      { key: 'viernes', width: 22 }
    ];
  
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'HORARIO DOCENTE - PERIODO ACADÉMICO';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1A202C' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const headerRow = worksheet.getRow(3);
    headerRow.values = ['MÓDULO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A7E92' } };
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const coloresAula: any = {
      '1° A': { bg: 'FFE5EBFF', font: 'FF4B4EBD' },
      '1° B': { bg: 'FFE2FAE8', font: 'FF20873A' },
      '2° C': { bg: 'FFFCE4DC', font: 'FFC04925' },
      '3° A': { bg: 'FFFFFAC2', font: 'FF9E7F0B' },
      '4° B': { bg: 'FFFAE6FF', font: 'FF9A209E' },
      '5° C': { bg: 'FFFCEDED', font: 'FFBD1523' },
    };

    let currentRow = 4;
    this.horarioData.forEach(fila => {
      const row = worksheet.getRow(currentRow);
      row.height = 45; 

      if (!fila.esProductiva) {
        worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
        row.getCell(1).value = `RECREO\n${this.extraerRango(fila.rangoHora)}`;
        row.getCell(2).value = `✦ RECREO ✦`;
        
        row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF5F5' } };
        row.getCell(2).font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFC53030' } };
        row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        row.values = [
          `${fila.bloque}\n${fila.rangoHora}`,
          this.formatearCeldaExcel(fila.lunes),
          this.formatearCeldaExcel(fila.martes),
          this.formatearCeldaExcel(fila.miercoles),
          this.formatearCeldaExcel(fila.jueves),
          this.formatearCeldaExcel(fila.viernes)
        ];
 
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
          else {
            const contenido = cell.value ? cell.value.toString() : '';
            const aula = this.extraerAula(contenido);

            if (aula && coloresAula[aula]) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: coloresAula[aula].bg } };
              cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: coloresAula[aula].font } };
            } else {
              cell.font = { name: 'Segoe UI', size: 9 };
            }
          }
        });
      }
      currentRow++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Horario_Docente_${new Date().getTime()}.xlsx`);
  }
    
  formatearCeldaExcel(celda: string): string {
    if (!celda || celda === '---' || celda === '-') return '---';
    const curso = this.extraerCurso(celda);
    const aula = this.extraerAula(celda);
    return aula ? `${curso}\n(${aula})` : curso;
  }

}