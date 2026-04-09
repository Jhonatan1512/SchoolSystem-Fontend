import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradoServiceService } from '../../../../core/services/grado-service.service';

@Component({
  selector: 'app-admin-grados', 
  imports: [NgForOf],
  templateUrl: './admin-grados.component.html',
  styleUrl: './admin-grados.component.css'
})
export class AdminGradosComponent implements OnInit{

  private gradoSerice = inject(GradoServiceService);

  listaGrado: any[] = [];

  ngOnInit() {
    this.obtenerGrados();
  }

  obtenerGrados() {
    this.gradoSerice.getAll().subscribe({
      next: (data) => {
        this.listaGrado = data;
        //console.log(data);
      }
    })
  }
  abrirModal(){

  }

  cerrarModal(){

  }
      
}
