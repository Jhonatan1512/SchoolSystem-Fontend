import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPeriodosComponent } from './admin-periodos/admin-periodos.component';
import { AdminTrimestreComponent } from './admin-trimestre/admin-trimestre.component';
import { AdminGradosComponent } from './admin-grados/admin-grados.component';
import { AdminSeccionesComponent } from './admin-secciones/admin-secciones.component';
import { AdminCuposSeccionComponent } from './admin-cupos-seccion/admin-cupos-seccion.component';

@Component({
  selector: 'app-admin-configuracion-escolar',
  standalone: true,
  imports: [CommonModule, AdminPeriodosComponent, AdminTrimestreComponent, AdminGradosComponent, AdminSeccionesComponent, AdminCuposSeccionComponent ],
  templateUrl: './admin-configuracion-escolar.component.html',
  styleUrl: './admin-configuracion-escolar.component.css'
})
export class AdminConfiguracionEscolarComponent {
  tabActiva: string = 'P';

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }
}