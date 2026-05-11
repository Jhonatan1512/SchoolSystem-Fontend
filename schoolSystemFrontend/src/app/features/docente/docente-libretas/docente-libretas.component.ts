import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../../core/services/docente.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-docente-libretas',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './docente-libretas.component.html',
  styleUrl: './docente-libretas.component.css'
})
export class DocenteLibretasComponent implements OnInit { 
  private docenteService = inject(DocenteService);

  listaAlumnos: any[] = [];

  ngOnInit() {
    this.obtenerAlumnosTutoria();
  }

  obtenerAlumnosTutoria(){
    this.docenteService.getAlumnosTutoria().subscribe({
      next: (data) => {
        this.listaAlumnos = data;
        //console.log(data);
      }
    });
  }

  decargarLibreta(alumnoId: number){
    this.docenteService.getLibreta(alumnoId).subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }
}
