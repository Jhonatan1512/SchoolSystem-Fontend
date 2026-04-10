import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationServiceService } from '../../../../core/services/notification.service.service';
import { ConfiguracionCuposService } from '../../../../core/services/configuracion-cupos.service';

@Component({
  selector: 'app-admin-cupos-seccion',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cupos-seccion.component.html',
  styleUrl: './admin-cupos-seccion.component.css'
})
export class AdminCuposSeccionComponent implements OnInit{
  private configService = inject(ConfiguracionCuposService);
  private toastService = inject(NotificationServiceService);

  isModalOpen: boolean = false;

  //listaSecciones: any[] = [];
  listaDetalles: any[] = []; 

  ngOnInit() {
    //this.obtenerSecciones();
    this.obtenerDetallesSeccionGrado();
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }

  obtenerDetallesSeccionGrado(){
    this.configService.getAll().subscribe({
      next: (data) => {
        this.listaDetalles = Array.isArray(data) ? data : [data] ;
        //console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
