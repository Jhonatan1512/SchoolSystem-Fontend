import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Horarios';

  getByGradoSeccion(gradoId: number, seccionId: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/ver/${gradoId}/${seccionId}`);
  }
  constructor() { }
}
