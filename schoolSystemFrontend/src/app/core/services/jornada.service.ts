import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {

  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7032/api/PlanEstudio";

  getAll(pagina:number, cantidad:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/lista-paginada?pagina=${pagina}&cantidad=${cantidad}`);
  }

  create(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}`, data);
  }

  constructor() { }
}
