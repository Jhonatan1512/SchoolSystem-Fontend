import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true
  });

  succes(message: string){
    this.toast.fire({icon: 'success', title: message});
  }

  error(message: string){
    this.toast.fire({icon: 'error', title: message});
  }
  warning(message: string){
    this.toast.fire({icon: 'warning', title: message});
  }
  async confirmar(titulo: string, texto: string) {
    return await Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
  }
}
