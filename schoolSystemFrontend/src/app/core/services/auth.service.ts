import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7032/api/Auth';

  iniciarSesion(credenciales: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((respuesta: any) => {
        if(respuesta && respuesta.token){
          localStorage.setItem('token', respuesta.toke);
          console.log('Token guardado');
        }
      }) 
    )
  }

  obtenerPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token', error);
      return {};
    }
  }

  obtenerNombreUsuario(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'Invitado';

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Esta es la forma correcta de decodificar UTF-8 en un navegador
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      return payload.nombre || 'Usuario';
    } catch (e) {
      console.error('Error decodificando token:', e);
      return 'Usuario';
    }
  }

  cerrarSesion(){
    localStorage.removeItem('token');
  }
  
}
