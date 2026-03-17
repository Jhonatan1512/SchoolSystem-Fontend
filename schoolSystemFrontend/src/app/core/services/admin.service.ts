import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Alumno';

  ontenerAlumnos(): Observable<any>{
    return this.http.get(`${this.apiUrl}`);
  }

  CrearAlumno(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, data);
  }
  constructor() { } 
}
