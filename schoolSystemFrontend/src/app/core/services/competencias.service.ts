import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenciasService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7032/api/Competencia';

  create(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, data);
  }

  update(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  constructor() { }
}
