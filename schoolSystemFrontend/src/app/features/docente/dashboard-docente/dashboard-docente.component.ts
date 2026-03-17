import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocenteService } from '../../../core/services/docente.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-docente',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-docente.component.html',
  styleUrl: './dashboard-docente.component.css'
})
export class DashboardDocenteComponent implements OnInit {
  private docenteService = inject(DocenteService);
  private router = inject(Router);

  listaCursos: any[] = [];
  cargando: boolean = true;
  mensajeError: string = '';

  ngOnInit(){
    this.cargarCursos();
    
  }

  cargarCursos(): void{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if(!token){
      console.warn('No hay token');
      this.router.navigate(['/login']);
      return; 
    }

    this.docenteService.obtenerCursos().subscribe({
      next: (data:any) => {
        this.listaCursos = data;
        console.log("datos de la api", data);
        if(data && data.data && Array.isArray(data.data)){
          this.listaCursos = [...data.data];
        }
        this.cargando = false;
      }, 
      error: (err) => {
        console.log(err);
        this.cargando = false;
      }
    });
  }
 
}
 