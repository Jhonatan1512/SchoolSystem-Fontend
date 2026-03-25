import { Component, inject, OnInit } from '@angular/core';
import { CursosService } from '../../../../core/services/cursos.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-cursos-competencias',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-cursos-competencias.component.html',
  styleUrl: './admin-cursos-competencias.component.css'
})

export class AdminCursosCompetenciasComponent implements OnInit {
  private cursoService = inject(CursosService);
  private route = inject(ActivatedRoute);

  cursoId: number = 0;

  listaComptencias: any[] = [];
  cursoInfo: any = null;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.cursoId = idParam ? parseInt(idParam) : 0;

    const estadoNavegacion = history.state;
    if(estadoNavegacion && estadoNavegacion.curso){
      this.cursoInfo = estadoNavegacion.curso;
    }

    if(this.cursoId > 0){
      this.mostrarCompetencias();
    }
  }

  mostrarCompetencias(){
    this.cursoService.getById(this.cursoId).subscribe({
      next: (res: any) => {
        this.listaComptencias = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
