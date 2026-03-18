import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-asignacion-docente',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-asignacion-docente.component.html',
  styleUrl: './admin-asignacion-docente.component.css'
})
export class AdminAsignacionDocenteComponent implements OnInit {

  isModalOpen: boolean = false;

  ngOnInit() {     
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  cerrarModal(){
    this.isModalOpen = false;
  }
  
}
