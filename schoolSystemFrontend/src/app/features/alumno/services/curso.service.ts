import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
 
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'https://localhost:7032/api/Alumno';

  obtenerCursosAlumno(): Observable<any>{    
    return this.http.get(`${this.apiUrl}/mis-cursos`)    
  }

  obtenerNotasPorCurso(cursoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-cursos/${cursoId}/detalle`);
  } 
  constructor() { } 
}
