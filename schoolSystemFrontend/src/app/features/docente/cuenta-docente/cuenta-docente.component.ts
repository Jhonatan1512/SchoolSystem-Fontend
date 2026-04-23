import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-cuenta-docente',
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta-docente.component.html',
  styleUrl: './cuenta-docente.component.css'
})
export class CuentaDocenteComponent implements OnInit {
  private docenteService = inject(DocenteService);
  private toastService = inject(NotificationServiceService);
 
  perfilDocente: any = [];

  showPasswordActual: boolean = false;
  showPasswordNueva: boolean = false;

  dataDocente = {
    passwordActual: '',
    nuevaPassword: ''
  }
 
  ngOnInit() {
    this.getPerfil();
  } 

  togglePasswordActual() {
    this.showPasswordActual = !this.showPasswordActual;
  }

  togglePasswordNueva() {
    this.showPasswordNueva = !this.showPasswordNueva;
  }

  getPerfil(){
    this.docenteService.getPerfil().subscribe({
      next: (data) => {
        this.perfilDocente = data;
      },
      error: () => {
        this.toastService.error("Error al cargar datos del docente");
      }
    });
  }
  
  onCambiarPassword(){
    const { passwordActual, nuevaPassword } = this.dataDocente;
    if(!passwordActual || !nuevaPassword){
      this.toastService.warning("Todos los campos son obligatorios");
      return;
    }

    const passwordRex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if(!passwordRex){
      this.toastService.warning("La nueva contraseña debe tener al menos una letra mayúscula, un número y un caracter especial");
      return;
    }

    const body = {
      passwordActual, nuevaPassword
    }

    this.docenteService.updatePaswordDocente(body).subscribe({
      next: () => {
        this.toastService.succes("Password modificada");
        this.limpiarCampos();
      },
      error: (err) => {
        console.log("Accediendo al mensaje:", err.error.mensaje);
        let mensajeerr = "Error inesperado";
        if(err.error && err.error.mensaje){
          mensajeerr = err.error.mensaje;
        } else if(err.error && err.error.detalles){
          mensajeerr = err.error.mensaje + ": " + err.error.detalles.join(", ");
        }
        this.toastService.error(mensajeerr);
        this.limpiarCampos();
      }
    });    
  }

  limpiarCampos() {
    this.dataDocente.nuevaPassword = '';
    this.dataDocente.passwordActual = '';
  }
}

