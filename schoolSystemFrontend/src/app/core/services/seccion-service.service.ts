import { Injectable,inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeccionServiceService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api';

  getAllSeccion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Seccion`);
  }
  constructor() { }
}
