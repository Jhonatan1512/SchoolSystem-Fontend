import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CursoService } from '../services/curso.service';
import { Router } from '@angular/router';

 const CURRICULO_PERU: { [key: string]: { icono: string, bg: string } } = {
  'MATEMÁTICA': { icono: 'calculate', bg: 'bg-math' },
  'COMUNICACIÓN': { icono: 'menu_book', bg: 'bg-science' },
  'INGLÉS': { icono: 'translate', bg: 'bg-math' },
  'ARTE Y CULTURA': { icono: 'palette', bg: 'bg-science' },
  'CIENCIAS SOCIALES': { icono: 'public', bg: 'bg-math' },
  'DESARROLLO PERSONAL, CIUDADANÍA Y CÍVICA': { icono: 'groups', bg: 'bg-science' },
  'EDUCACIÓN FÍSICA': { icono: 'fitness_center', bg: 'bg-math' },
  'EDUCACIÓN RELIGIOSA': { icono: 'auto_stories', bg: 'bg-science' },
  'CIENCIA Y TECNOLOGÍA': { icono: 'biotech', bg: 'bg-science' },
  'EDUCACIÓN PARA EL TRABAJO': { icono: 'construction', bg: 'bg-math' },
  'TUTORÍA Y ORIENTACIÓN EDUCATIVA': { icono: 'psychology', bg: 'bg-science' },
  'HISTÓRIA': { icono: 'public', bg: 'bg-math' },
}; 

@Component({
  selector: 'app-dashboard-alumno',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-alumno.component.html',
  styleUrl: './dashboard-alumno.component.css'
}) 
export class DashboardAlumnoComponent implements OnInit { 
  
  private cursoService = inject(CursoService);
  private router = inject(Router);

  misCursos: any[] = []; 
  
  cargando: boolean = true;
  mensjaeError: string = '';

  nombreAlumno: string ='';

  ngOnInit() {
    this.cargarCursos();    
  }

  cargarCursos(){
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if(!token){
      console.warn('No hay token');
      this.router.navigate(['/login']);
      return;
    }
    
    this.cursoService.obtenerCursosAlumno().subscribe({
      next: (datosCurso) => {
        console.log(datosCurso);
        this.misCursos = datosCurso.map((cursoDb: any) => {
          const diseño = this.obtenerDiseñoPorCurso(cursoDb.nombreCurso);

          return {
            id: cursoDb.cursoId,
            nombre: cursoDb.nombreCurso,
            docente: cursoDb.nombreDocente,
            icono: diseño.icono,
            bg: diseño.bg
          };
        });
        this.cargando = false;
      },
      error: (err) => {
        console.log(err);
        this.mensjaeError = "No pudimos cargar tus cursos";
        this.cargando = false;
      }
    })
  }

  obtenerDiseñoPorCurso(nombreCurso: string){
    if(!nombreCurso) return {icono: 'school', bg: 'bg-science'};
    const nombreNormalizado = nombreCurso.toUpperCase().trim();
    if(CURRICULO_PERU[nombreNormalizado]){
      return CURRICULO_PERU[nombreNormalizado];
    }

    const llaveEncontrada = Object.keys(CURRICULO_PERU).find(key => 
      nombreNormalizado.includes(key) || key.includes(nombreNormalizado)
    );

    if(llaveEncontrada){
      return CURRICULO_PERU[llaveEncontrada];
    }

    return {icono: 'school', bg: 'bg-science'}
  }

  verNotas(cursoId: number) {
    this.router.navigate(['/alumno/notas', cursoId]);
  }

}
