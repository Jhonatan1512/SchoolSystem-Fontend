import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { Location } from '@angular/common';
import { NotificationServiceService } from '../../../core/services/notification.service.service';

@Component({
  selector: 'app-notas-docente',
  imports: [CommonModule, FormsModule],
  templateUrl: './notas-docente.component.html',
  styleUrl: './notas-docente.component.css'
})
export class NotasDocenteComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private docenteService = inject(DocenteService);
  private location = inject(Location);
  private notification = inject(NotificationServiceService);

  infoCurso: any = {nombre: '', aula: ''};

  cursoId!: number;
  datosCurso: any = null;
  alumnos: any[] = [];
  competencias: any[] = [];
  seccionId!: number;

  notas: any[] = [];

  editando: boolean = false;
  trimestreSeleccionado: number = 1;

  ngOnInit() {
      this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
      this.seccionId = Number(this.route.snapshot.paramMap.get('seccionId'));
      console.log(`Buscando Curso: ${this.cursoId} en Sección: ${this.seccionId}`);

      this.cargarDatos();
  }

  cargarDatos(){
    this.docenteService.obtenerDetalleCursos(this.cursoId, this.seccionId)
      .subscribe({
        next: (res: any) => {
          this.competencias = res.competencias;
          this.alumnos = res.alumnos;
         if (this.alumnos && this.alumnos.length > 0) {
            this.infoCurso = {
              nombre: this.alumnos[0].nombreCurso,
              aula: this.alumnos[0].aula
            }
          }
        },
        error: (err) => {
          console.error("Error en la API:", err);
        }
      });
  }

  obtenerNota(alumno: any, competenciaId: number): string {
    if (!alumno.notasRegistradas) return '';
    const notaObj = alumno.notasRegistradas.find((n: any) => n.competenciaId === competenciaId);
    return notaObj ? notaObj.nota : '';
  }

  actualizarNota(alumno: any, competenciaId: number, nuevaNota: string) {
    if (!alumno.notasRegistradas) alumno.notasRegistradas = [];

    const notaObj = alumno.notasRegistradas.find((n: any) => n.competenciaId === competenciaId);

    if (notaObj) {
      notaObj.nota = nuevaNota.toUpperCase();
    } else {
      alumno.notasRegistradas.push({
        competenciaId: competenciaId,
        nota: nuevaNota.toUpperCase()
      });
    } 
  }

  async guardarCambios() {
    const result = await this.notification.confirmar(
      '¿Guardar Cambios?',
      'Se actualizara las notas en el sistema'
    );

    if(result.isConfirmed){
      const notasEnviar = [];

      for (const alumno of this.alumnos){
        for (const n of alumno.notasRegistradas){
          notasEnviar.push({
            nota: n.nota,
            trimestreId: Number(this.trimestreSeleccionado),
            competenciaId: n.competenciaId,
            detalleMatriculaId: alumno.detalleMatriculaId
          });
        }
      }

      console.log('Notas', notasEnviar);

      this.docenteService.registrarNotas(notasEnviar).subscribe({
        next: (notas) => {
          console.log('notas registradas', notas);
          this.notification.succes('Notas registradas correctamente');
          this.editando = false;
        },
        error: (err) => {
          this.notification.error('Error: no se pudo guardar las notas');
        }
      })
    }
  }
  
  volver() {
      this.location.back(); 
    }
  }
 