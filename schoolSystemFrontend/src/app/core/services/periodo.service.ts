import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api';

  getPeriodoActivo(): Observable<any>{
    return this.http.get(`${this.apiUrl}/PeriodoAcademico`);
  } 

  getPeriodoAll(): Observable<any>{
    return this.http.get(`${this.apiUrl}/Periodoacademico/all`);
  } 

  update(data: any, id: number): Observable<any>{
    return this.http.put(`${this.apiUrl}/Periodoacademico/${id}`, data);
  }

  create(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/PeriodoAcademico`, data);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/PeriodoAcademico/${id}`);
  }

  getActivo(): Observable<any>{
    return this.http.get(`${this.apiUrl}/PeriodoAcademico/periodo-activo`);
  }

  constructor() { }
}
