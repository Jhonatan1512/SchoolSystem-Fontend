import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService { 
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Docente'

  obtenerCursos(): Observable<any>{
    return this.http.get(`${this.apiUrl}/dashboard`)
  }
  obtenerDetalleCursos(cursoId: number, seccionId:  number): Observable<any>{
    return this.http.get(`${this.apiUrl}/curso/${cursoId}/seccion/${seccionId}/detalle`)
  } 

  registrarNotas(notas: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/notas`, notas);
  }

  constructor() { }
}
 