import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../services/curso.service';
import { TrimestreService } from '../../../core/services/trimestre.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-notas-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notas-alumno.component.html',
  styleUrl: './notas-alumno.component.css'
})
export class NotasAlumnoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cursoService = inject(CursoService);
  private trimestreService = inject(TrimestreService);

  cursoId: number = 0;
  nombreCurso: string = 'Cargando curso...';
  
  competencias: any[] = [];
  listadoTrimestresCompletos: any[] = []; 
  promediosTrimestrales: { [key: string]: string } = {};
  promedioFinalCurso: string = '-';
  cargando: boolean = true;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.cursoId = idParam ? parseInt(idParam) : 0;

    if (this.cursoId > 0) {
      this.cargarEstructuraYNotas();
    }
  }

  cargarEstructuraYNotas() {
    this.cargando = true;
    
    forkJoin({
      listaTrimestres: this.trimestreService.getAll(),
      dataNotas: this.cursoService.obtenerNotasPorCurso(this.cursoId)
    }).subscribe({
      next: ({ listaTrimestres, dataNotas }) => {
        this.nombreCurso = dataNotas.nombreCurso;

        this.listadoTrimestresCompletos = listaTrimestres.sort((a: any, b: any) => a.id - b.id);

        const grupos = dataNotas.competencias.reduce((acc: any, item: any) => {
          const compId = item.competenciaId;

          if (!acc[compId]) {
            acc[compId] = {
              nombre: item.nombreCompetencia,
              notasPorId: {}, 
              promedioHorizontal: '-'
            };
            this.listadoTrimestresCompletos.forEach(t => {
              acc[compId].notasPorId[t.id] = '-';
            });
          }

          const valorNota = (item.nota === 'Sin Calificación' || !item.nota) ? '-' : item.nota;
          acc[compId].notasPorId[item.trimestreId] = valorNota;

          return acc;
        }, {});

        this.competencias = Object.values(grupos);

        this.efectuarCalculos();
        
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar datos:", err);
        this.cargando = false;
        this.nombreCurso = 'Error al cargar información';
      }
    });
  }

  private efectuarCalculos() {
    this.listadoTrimestresCompletos.forEach(t => {
      const notasColumna = this.competencias.map(c => c.notasPorId[t.id] || '-');
      this.promediosTrimestrales[t.id] = this.calcularPromedioGrupal(notasColumna);
    });

    const valoresPromedios = Object.values(this.promediosTrimestrales);
    this.promedioFinalCurso = this.calcularPromedioGrupal(valoresPromedios);
  }

  calcularPromedioGrupal(notas: string[]): string {
    const filtradas = notas.filter(n => n !== '-' && n !== 'Sin Calificar' && n !== '');
    if (filtradas.length === 0) return '-';

    const valores: any = { 'AD': 4, 'A': 3, 'B': 2, 'C': 1 };
    const letras: any = { 4: 'AD', 3: 'A', 2: 'B', 1: 'C' };

    const suma = filtradas.reduce((acc, curr) => acc + (valores[curr.toUpperCase()] || 0), 0);
    const promedio = Math.round(suma / filtradas.length);
    return letras[promedio] || '-';
  }

  obtenerClaseNota(nota: string): string {
    if (!nota || nota === '-' || nota === '') return 'nota-vacia';
    const n = nota.toUpperCase().trim();
    if (n === 'AD' || n === 'A') return 'nota-alta';
    if (n === 'B') return 'nota-media';
    if (n === 'C') return 'nota-baja';
    return 'nota-vacia';
  }
}