import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignacionDocenteService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api';

  getAll(pagina:number, cantidad:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/AsignacionDocente/lista-paginada?pagina=${pagina}&cantidad=${cantidad}`);
  }

  asignarDocentes(dto: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/AsignacionDocente`, dto)
  }

  update(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/AsignacionDocente/${id}`);
  }

  getByGradoSeccion(gradoId:number, seccionId:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/AsignacionDocente/gradoId/${gradoId}/seccionId/${seccionId}`);
  }
  
  constructor() { }
}
