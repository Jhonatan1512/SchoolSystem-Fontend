import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7032/api/Alumno";

  getPerfil(): Observable<any>{
    return this.http.get(`${this.apiUrl}/perfil-alumno`);
  }

  updatePaswordDocente(data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/password`, data);
  }

  constructor() { }
}
