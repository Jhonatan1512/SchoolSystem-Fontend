import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7032/api';
  
  registrarMatricula(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Matricula`, data);
  }

  constructor() { }
}
