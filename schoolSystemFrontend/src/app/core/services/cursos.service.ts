import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Curso'

  getAll(pagina:number, cantidad:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lista-cursos?pagina=${pagina}&cantidad=${cantidad}`);
  }

  getById(cursoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cursoId}`);
  }

  create(curso: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, curso);
  }

  updateCurso(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/cursoId/${id}`, data);
  }

  getByGrado(gradoId:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/gradoId/${gradoId}`);
  }

  constructor() { }
}
