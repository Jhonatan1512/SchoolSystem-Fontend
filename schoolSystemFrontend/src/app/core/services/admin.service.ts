import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Alumno';

  ontenerAlumnos(pagina:number, cantidad:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/lista-paginada?pagina=${pagina}&cantidad=${cantidad}`);
  }
 
  CrearAlumno(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, data);
  }

  obtenerPorSeccion(gradoId: number, seccionId: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/gradoId/${gradoId}/seccionId/${seccionId}`);
  }

  getByDni(dni:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/dni/${dni}`).pipe(
      catchError(error => {
        if(error.status === 404){
          return of(null);
        }
        throw error;
      })
    );
  }

  updateEstado(id:number, estado:any): Observable<any>{
    return this.http.patch(`${this.apiUrl}/alumnoId/${id}`, estado);
  }

  update(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  updatePassword(dni:string, password:any): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${dni}`, password);
  }

  constructor() { } 
}
