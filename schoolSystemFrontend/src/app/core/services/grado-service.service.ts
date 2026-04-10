import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradoServiceService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api';

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Grado`);
  }

  getById(id: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/Grado/${id}`)
  }

  create(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/Grado`, data);
  }

  update(id: number, data: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/Grado/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Grado/${id}`);
  }

  constructor() { }
}
