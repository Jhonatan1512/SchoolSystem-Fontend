import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CursoService } from '../services/curso.service';
import { CronogramaService } from '../../../core/services/cronograma.service';
import { ConfiguracionCuposService } from '../../../core/services/configuracion-cupos.service';
import { GradoServiceService } from '../../../core/services/grado-service.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { NotificationServiceService } from '../../../core/services/notification.service.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlumnoService } from '../../../core/services/alumno.service';

const CURRICULO_PERU: { [key: string]: { icono: string, bg: string } } = {
  'MATEMÁTICA': { icono: 'calculate', bg: 'bg-math' },
  'COMUNICACIÓN': { icono: 'menu_book', bg: 'bg-science' },
  'INGLÉS': { icono: 'translate', bg: 'bg-math' },
  'ARTE Y CULTURA': { icono: 'palette', bg: 'bg-science' },
  'CIENCIAS SOCIALES': { icono: 'public', bg: 'bg-math' },
  'DESARROLLO PERSONAL, CIUDADANÍA Y CÍVICA': { icono: 'groups', bg: 'bg-science' },
  'EDUCACIÓN FÍSICA': { icono: 'fitness_center', bg: 'bg-math' },
  'EDUCACIÓN RELIGIOSA': { icono: 'auto_stories', bg: 'bg-science' },
  'CIENCIA Y TECNOLOGÍA': { icono: 'biotech', bg: 'bg-science' },
  'EDUCACIÓN PARA EL TRABAJO': { icono: 'construction', bg: 'bg-math' },
  'TUTORÍA Y ORIENTACIÓN EDUCATIVA': { icono: 'psychology', bg: 'bg-science' },
  'HISTÓRIA': { icono: 'public', bg: 'bg-math' },
}; 

@Component({
  selector: 'app-dashboard-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-alumno.component.html',
  styleUrl: './dashboard-alumno.component.css'
}) 
export class DashboardAlumnoComponent implements OnInit { 
  
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private cronogramaService = inject(CronogramaService);
  private configService = inject(ConfiguracionCuposService);
  private gradoService = inject(GradoServiceService);
  private matriculaService = inject(MatriculaService);
  private toastService = inject(NotificationServiceService);
  private authService = inject(AuthService);
  private alumnoService = inject(AlumnoService);

  misCursos: any[] = []; 
  cargando: boolean = true;
  mensajeError: string = '';
  nombreAlumno: string ='';
  alumnoId: number = 0; 

  mostrarModal: boolean = false;
  esAlumnoNuevo: boolean = true; 
  
  gradoId: number = 0;
  seccionId: number = 0;

  listaCronogramas: any[] = [];
  listaGrados: any[] = [];
  listaSecciones: any[] = [];
  
  cuposDisponiblesNuevos: any[] = [];
  seccionesFiltradas: any[] = []; 
  cupoAlumnoAntiguo: any = null;

  estadoCronograma: string = 'ESPERANDO_SELECCION'; 
  tiempoRestante: string = '';
  intervaloTemporizador: any;
  fechaInicioVisible!: Date;

  ngOnInit() {
    this.obtenerAlumnoId(); 
    this.obtenerGrdos();
  }

  ngOnDestroy() {
    this.limpiarTemporizador();
  }

  obtenerAlumnoId() {
    const idAlumno = this.authService.obtenerIdUsuario()
    this.alumnoId = idAlumno;
  }
  
  cargarCursos(){
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if(!token){
      console.warn('No hay token');
      this.router.navigate(['/login']);
      return;
    }
      
    this.cargando = true;
    this.cursoService.obtenerCursosAlumno().subscribe({
      next: (datosCurso) => {
        if (!datosCurso || datosCurso.length === 0) {
          this.mostrarModal = true;
          this.cargando = false;
          this.prepararDatosMatricula(); 
          return;
        }

        this.misCursos = datosCurso.map((cursoDb: any) => {
          const diseño = this.obtenerDiseñoPorCurso(cursoDb.nombreCurso);
          const docentesCurso = cursoDb.docentes && cursoDb.docentes.length > 0
            ? cursoDb.docentes.map((d: any) => d.nombre)
            : ['Sin docente'];

          return {
            id: cursoDb.cursoId,
            nombre: cursoDb.nombreCurso,
            docente: docentesCurso,
            icono: diseño.icono,
            bg: diseño.bg,
            nombreAula: cursoDb.nombreAula
          };
        });
        this.cargando = false;
      },
      error: (err) => {
        console.log(err);
        this.mensajeError = "No pudimos cargar tus cursos";
        this.cargando = false;
      }
    });
  }

  obtenerGrdos(){
    this.gradoService.getAll().subscribe({
      next: (data) => {
        this.listaGrados = data;
        this.cargarCursos();
      }
    })
  }

  prepararDatosMatricula() {
    this.alumnoService.getUltimaMatricula(this.alumnoId).subscribe({
      next: (data: any) => {
        if (data && data.gradoId > 0) {
          this.esAlumnoNuevo = false;

          const indexActual = this.listaGrados.findIndex(g => g.id === data.gradoId);

          if (indexActual !== -1 && indexActual < this.listaGrados.length - 1) {
            this.gradoId = this.listaGrados[indexActual + 1].id;
            this.seccionId = data.seccionId; 
            this.cargarCronogramasYContinuar();
          } else {
            this.gradoId = data.gradoId;
            this.estadoCronograma = 'VENCIDO'; 
            this.toastService.warning("Situación Actual: Egresado");
          }
        } else {
          this.esAlumnoNuevo = true;
          this.gradoId = 0;
          this.seccionId = 0;
          this.cargarCronogramasYContinuar();
        }
      },
      error: (err) => {
        console.warn("No se encontró historial, se tratará como alumno nuevo", err);
        this.esAlumnoNuevo = true;
        this.gradoId = 0;
        this.seccionId = 0;
        this.cargarCronogramasYContinuar();
      }
    });
  }

  cargarCronogramasYContinuar() {
    this.cronogramaService.getAll().subscribe({
      next: (data: any) => {
        this.listaCronogramas = Object.values(data).filter(item => typeof item === 'object');
        
        if (this.esAlumnoNuevo) {
          this.estadoCronograma = 'ESPERANDO_SELECCION';
          this.obtenerCuposAlumnoNuevo();
        } else {
          this.obtenerCuposAlumnoAntiguo();
          this.evaluarCronograma(); 
        }
      }
    });
  }

  obtenerCuposAlumnoNuevo() {
    this.configService.getAll().subscribe({
      next: (data: any) => {
        this.cuposDisponiblesNuevos = Object.values(data).filter(item => typeof item === 'object');
      }
    });
  }

  obtenerCuposAlumnoAntiguo() {
    let gradoId = Number(this.gradoId);
    let seccionId = Number(this.seccionId);
    this.configService.getByGradoSeccion(gradoId, seccionId).subscribe({
      next: (data: any) => {
        this.cupoAlumnoAntiguo = data;
      },
      error: (err) => {
        this.cupoAlumnoAntiguo = null; 
        this.estadoCronograma = 'FUTURO'; 
        this.toastService.error("No hay vacantes habilitadas para tu próximo grado.");
      }
    });
  }

  alCambiarGrado() {
    this.seccionId = 0; 
    this.evaluarCronograma();
    this.seccionesFiltradas = this.cuposDisponiblesNuevos.filter(c => c.gradoId == this.gradoId);
  }

  matricular() {
    if (this.gradoId == 0 || this.seccionId == 0) return;

    const body = {
      alumnoId: Number(this.alumnoId),
      gradoId: Number(this.gradoId),
      seccionId: Number(this.seccionId)
    };

    this.matriculaService.registrarMatricula(body).subscribe({
      next: () => {
        this.toastService.succes("Su matrícula a sido registrada");
        this.cargarCursos();
        this.cerrarModal();
      },
      error: () => {
        this.toastService.error("Error al registrar su matícula");
      }
    });
  }

  evaluarCronograma() {
    this.limpiarTemporizador();

    if (this.gradoId == 0) {
      this.estadoCronograma = 'ESPERANDO_SELECCION';
      return;
    }

    const cronograma = this.listaCronogramas.find(c => c.gradoId == this.gradoId);
    if (!cronograma) {
      this.estadoCronograma = 'FUTURO'; 
      return;
    }

    const ahora = new Date().getTime();
    this.fechaInicioVisible = new Date(cronograma.fechaHoraInicio);
    const cierreVisible = new Date(cronograma.fechaHoraCierre);
    const inicio = this.fechaInicioVisible.getTime();
    const cierre = cierreVisible.getTime();

    if (!cronograma.estadoActivo || ahora < inicio) {
      this.estadoCronograma = 'FUTURO';
    } 
    else if (ahora > cierre) {
      this.estadoCronograma = 'VENCIDO';
    } 
    else {
      this.estadoCronograma = 'ACTIVO';
      this.iniciarTemporizador(cierre);
    }
  }

  iniciarTemporizador(fechaCierreMs: number) {
    this.actualizarTextoTemporizador(fechaCierreMs);
    this.intervaloTemporizador = setInterval(() => {
      const sigueActivo = this.actualizarTextoTemporizador(fechaCierreMs);
      if (!sigueActivo) {
        this.limpiarTemporizador();
        this.estadoCronograma = 'VENCIDO';
      }
    }, 1000);
  }

  actualizarTextoTemporizador(fechaCierreMs: number): boolean {
    const ahora = new Date().getTime();
    const distancia = fechaCierreMs - ahora;

    if (distancia < 0) return false;

    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    this.tiempoRestante = `${horas}h ${minutos}m ${segundos}s`;
    return true;
  }

  limpiarTemporizador() {
    if (this.intervaloTemporizador) clearInterval(this.intervaloTemporizador);
  }

  cerrarModal() {
    this.mostrarModal = false;
  } 

  obtenerDiseñoPorCurso(nombreCurso: string){
    if(!nombreCurso) return {icono: 'school', bg: 'bg-science'};
    const nombreNormalizado = nombreCurso.toUpperCase().trim();
    if(CURRICULO_PERU[nombreNormalizado]) return CURRICULO_PERU[nombreNormalizado];

    const llaveEncontrada = Object.keys(CURRICULO_PERU).find(key => 
      nombreNormalizado.includes(key) || key.includes(nombreNormalizado)
    );
 
    if(llaveEncontrada) return CURRICULO_PERU[llaveEncontrada];
    return {icono: 'school', bg: 'bg-science'}
  }

  verNotas(cursoId: number) { 
    this.router.navigate(['/alumno/notas', cursoId]);
  }
}