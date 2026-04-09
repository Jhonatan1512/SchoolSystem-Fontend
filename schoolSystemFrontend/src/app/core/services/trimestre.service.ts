import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrimestreService {
  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7032/api";

  getAll():Observable<any>{
    return this.http.get(`${this.apiUrl}/trimestre/periodo`);
  }

  create(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/Trimestre`, data);
  }

  updateDate(id: number, nuevaFecha: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/Trimestre/${id}/extender`, nuevaFecha);
  }

  updateTrimestre(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/Trimestre/${id}`, data);
  }

  delete(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/Trimestre/${id}`);
  }

  constructor() { }
}
