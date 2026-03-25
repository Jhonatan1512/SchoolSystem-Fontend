import { Component, OnInit, Inject, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CursoService } from '../services/curso.service';

@Component({
  selector: 'app-notas-alumno',
  imports: [CommonModule, RouterModule],
  templateUrl: './notas-alumno.component.html',
  styleUrl: './notas-alumno.component.css'
})
export class NotasAlumnoComponent {
  private route = inject(ActivatedRoute);
  private cursoService = inject(CursoService);
 
  cursoId: number = 0;
  nombreCurso: string = 'Cargando curso....'

  competencias: any[] = [];
  cargando: boolean = true;

  promedioT1: string = '-';
  promedioT2: string = '-';
  promedioT3: string = '-';

  promedioFinalCurso: string = '-';

  ngOnInit(){
    const idParam = this.route.snapshot.paramMap.get('id');
    this.cursoId = idParam ? parseInt(idParam) : 0; 

    if (this.cursoId > 0) {
      this.CargarNotas();
    }
  }

  CargarNotas() {
    this.cursoService.obtenerNotasPorCurso(this.cursoId).subscribe({
      next: (data) => { 
        this.nombreCurso = data.nombreCurso;

        const grupos = data.competencias.reduce((acc: any, item: any) => {
          if(!acc[item.competenciaId]){
            acc[item.competenciaId] = {
              nombre: item.nombreCompetencia,
              t1: '-', t2: '-', t3: '-',
              promedio: '-'
            };
          }

          const notaFinal = item.nota === 'Sin Calificación' ? '-' :item.nota;
          if (item.nombreTrimestre.includes('1')) acc[item.competenciaId].t1 = notaFinal;
          if (item.nombreTrimestre.includes('2')) acc[item.competenciaId].t2 = notaFinal;
          if (item.nombreTrimestre.includes('3')) acc[item.competenciaId].t3 = notaFinal;

          return acc;
        }, {});

        this.competencias = Object.values(grupos);
        this.promedioT1 = this.calcularPromedioGrupal(this.competencias.map(c => c.t1));
        this.promedioT2 = this.calcularPromedioGrupal(this.competencias.map(c => c.t2));
        this.promedioT3 = this.calcularPromedioGrupal(this.competencias.map(c => c.t3));

        // 3. CALCULAR PROMEDIO FINAL DEL CURSO (De los 3 trimestres)
        if (this.promedioT1 !== '-' && this.promedioT2 !== '-' && this.promedioT3 !== '-') {
            this.promedioFinalCurso = this.calcularPromedioGrupal([this.promedioT1, this.promedioT2, this.promedioT3]);
        } else {
            this.promedioFinalCurso = '-'; 
        }
        console.log(data);
      },
      error: (err) => {
        console.error('Error al cargar notas:', err);
        this.nombreCurso = 'Error al cargar';
        this.cargando = false;
      }
    })
  }

  calcularPromedioGrupal(notas: string[]): string {
    const filtradas = notas.filter(n => n !== '-' && n !== 'Sin Calificar');
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
