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

  constructor() { }
}
