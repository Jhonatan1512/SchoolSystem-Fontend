import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionCuposService {
  private http = inject(HttpClient);

  private apiUrl = "https://localhost:7032/api";

  getAll(): Observable<any>{
    return this.http.get(`${this.apiUrl}/Configuracion`);
  } 

  create(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/Configuracion/create`, data);
  }

  update(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/Configuracion/${id}`, data)
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/Configuracion/${id}`);
  }

  getByGrado(gradoId:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/Configuracion/grado/${gradoId}`);
  }

  constructor() { }
}
