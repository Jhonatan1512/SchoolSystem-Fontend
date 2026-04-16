import { Injectable,inject } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';
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

  create(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/Seccion`, data);
  }

  update(id:number, data:any): Observable<any>{
    return this.http.put(`${this.apiUrl}/Seccion/${id}`, data);
  }

  delete(id:number): Subscribable<any>{
    return this.http.delete(`${this.apiUrl}/Seccion/${id}`);
  }
  
  constructor() { } 
}
