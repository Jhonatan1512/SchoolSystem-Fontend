import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { Location } from '@angular/common';
import { NotificationServiceService } from '../../../core/services/notification.service.service';
import { TrimestreService } from '../../../core/services/trimestre.service';

@Component({
  selector: 'app-notas-docente',
  imports: [CommonModule, FormsModule],
  templateUrl: './notas-docente.component.html',
  styleUrl: './notas-docente.component.css'
})
export class NotasDocenteComponent implements OnInit {
  private trimestreService = inject(TrimestreService);
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
  listrimestres: any[] = [];

  editando: boolean = false;
  trimestreSeleccionadoId: number = 0;

  ngOnInit() {
      this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
      this.seccionId = Number(this.route.snapshot.paramMap.get('seccionId'));

      this.cargarDatos();

      this.obtenerTrimestres();
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

  obtenerTrimestres(){
    this.trimestreService.getAll().subscribe({
      next: (data) => {
        this.listrimestres = data;
        const activo = data.find((t:any) => t.estadoActivo);
        if(activo) this.trimestreSeleccionadoId = activo.id;
      },
      error: () => {
        this.notification.error("Error al cargar información de trimestres");
      } 
    });
  }

  seleccionarTrimestre(id:number){
    this.trimestreSeleccionadoId = id;
  }

  obtenerNota(alumno: any, competenciaId: number): string {
    if (!alumno.notasRegistradas || !this.trimestreSeleccionadoId) return '';
    const notaObj = alumno.notasRegistradas.find((n: any) => 
      n.competenciaId === competenciaId &&
      n.trimestreId === Number(this.trimestreSeleccionadoId)
    );
    return notaObj ? notaObj.nota : '';
  }

  actualizarNota(alumno: any, competenciaId: number, nuevaNota: string) {
    if (!alumno.notasRegistradas) alumno.notasRegistradas = [];

    const notaObj = alumno.notasRegistradas.find((n: any) => 
      n.competenciaId === competenciaId && 
    n.trimestreId === Number(this.trimestreSeleccionadoId));

    if (notaObj) {
      notaObj.nota = nuevaNota.toUpperCase();
    } else {
      alumno.notasRegistradas.push({
        competenciaId: competenciaId,
        trimestreId: Number(this.trimestreSeleccionadoId),
        nota: nuevaNota.toUpperCase()
      });
    }  
  }

  async guardarCambios() {
    if(!this.canEdit){
      this.notification.error("Operación no permitida");
      return;
    }
    const result = await this.notification.confirmar(
      '¿Guardar Cambios?',
      'Se actualizara las notas en el sistema'
    );

    if(result.isConfirmed){
      const notasEnviar = [];

      for (const alumno of this.alumnos){
        for (const n of alumno.notasRegistradas){
          if(n.trimestreId === Number(this.trimestreSeleccionadoId))
          notasEnviar.push({
            nota: n.nota,
            trimestreId: Number(this.trimestreSeleccionadoId),
            competenciaId: n.competenciaId,
            detalleMatriculaId: alumno.detalleMatriculaId
          });
        }
      }

      this.docenteService.registrarNotas(notasEnviar).subscribe({
        next: (notas) => {
          this.notification.succes('Notas registradas correctamente');
          this.editando = false;

          this.alumnos.forEach(alumno => {
            const notasAlumno = notas.filter((nr: any) => nr.detalleMatriculaId == alumno.detalleMatriculaId);
            if(notasAlumno.length > 0){
              alumno.notasRegistradas = [
                ...alumno.notasRegistradas.filter((n: any) => n.trimestreId !== this.trimestreSeleccionadoId),
                ...notasAlumno
              ]
            }
          });
        },
        error: (err) => {
          this.notification.error('Error: no se pudo guardar las notas');
        }
      });
    }
  }
  
  get canEdit(): boolean {
    if(!this.trimestreSeleccionadoId || this.listrimestres.length === 0) return false;

    const trimestre = this.listrimestres.find(t => t.id === Number(this.trimestreSeleccionadoId));

    return trimestre ? trimestre.estadoActivo : false;
  }

  volver() {
      this.location.back(); 
    }
  }
 