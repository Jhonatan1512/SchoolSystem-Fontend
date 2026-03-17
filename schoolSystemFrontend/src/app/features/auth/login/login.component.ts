import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  mensajeError: string = '';
  cargando: boolean = false;

  iniciarSesion(){
    if(this.loginForm.valid){
      this.cargando = true;
      this.mensajeError = '';

      const credenciales = {
        email: this.loginForm.value.usuario,
        password: this.loginForm.value.password
      };

      this.authService.iniciarSesion(credenciales).subscribe({
        next: (response) => {
          const token = response.token;
          localStorage.setItem('token', token);

          const payload = this.authService.obtenerPayload(token);
          
          const rol = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

          console.log('Rol detectado:', rol);
 
          setTimeout(() => {
            if (rol === 'Docente') {
              this.router.navigate(['/docente']);
            } else if (rol === 'Alumno') {
              this.router.navigate(['/alumno']);
            } else {
              this.router.navigate(['/admin']);
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error en el login', err);
          this.cargando = false;
          this.mensajeError = 'Usuario o contraseña incorrectos';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  
}