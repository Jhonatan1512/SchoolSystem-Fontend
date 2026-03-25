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
    return this.http.get(`${this.apiUrl}/Periodoacademico`);
  }

  constructor() { }
}
