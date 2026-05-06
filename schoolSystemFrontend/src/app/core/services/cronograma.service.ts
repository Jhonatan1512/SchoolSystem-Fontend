import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {

  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7032/api/CronogramaMatricula";

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  } 

  create(body: any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, body);
  }

  update(id: number, body: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/actualizar/${id}`, body);
  }

  constructor() { }
}
