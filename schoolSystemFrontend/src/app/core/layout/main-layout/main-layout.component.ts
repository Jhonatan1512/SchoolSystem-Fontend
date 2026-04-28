import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})

export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);

  nombreAlumno: string = 'Cargargando...';
  iniciales: string = '??';
  rolActual = '';

  menuItems: any[] = [];

  ngOnInit() {
      this.cargarDatosUsuario();
      this.definirMenuRol();
  }

  definirMenuRol(){
    const token = localStorage.getItem('token');
    if(!token) return;

    const payload = this.authService.obtenerPayload(token);
    this.rolActual = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    
    if (this.rolActual === 'Admin') {
      this.menuItems = [
        { titulo: 'Panel Admin', ruta: '/admin', icono: 'admin_panel_settings' },
        { titulo: 'Alumnos', ruta: '/admin/alumnos', icono: 'group' },
        { titulo: 'Alumnos por Sección', ruta: '/admin/alumnos-seccion', icono: 'group' },
        { titulo: 'Cursos', ruta: '/admin/cursos', icono: 'menu_book' },
        { titulo: 'Docentes', ruta: '/admin/docentes', icono: 'person_book' },
        { titulo: 'Asignación Docente', ruta: '/admin/asignacion-docente', icono: 'co_present' }, 
        { titulo: 'Matriculas', ruta: '/admin/matriculas', icono: 'how_to_reg' }, 
        { titulo: 'Configuración académica', ruta: '/admin/configuracion', icono: 'calendar_clock' },
        { titulo: 'Horarios', ruta: '/admin/horarios', icono: 'calendar_month'},
        { titulo: 'Configuración', ruta: '/admin/ajustes', icono: 'settings_account_box' },
      ]; 
    } else if (this.rolActual === 'Docente') { 
      this.menuItems = [
        { titulo: 'Cursos Asignados', ruta: '/docente', icono: 'menu_book' },
        { titulo: 'Cuenta', ruta: '/docente/cuenta', icono: 'settings_account_box' },
      ];
    } else {
      this.menuItems = [
        { titulo: 'Dashboard', ruta: '/alumno', icono: 'dashboard' },
        { titulo: 'Horario', ruta: '/horario', icono: 'calendar_month' },
        { titulo: 'Mi Perfil', ruta: '/perfil', icono: 'person' },
      ];
    }
  }

  cargarDatosUsuario(){
    const nombre = this.authService.obtenerNombreUsuario();
    this.nombreAlumno = nombre;

    const partes = nombre.split(' ');
    this.iniciales = partes.length > 1 
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : nombre.substring(0, 2).toUpperCase();      
  }


  cerrarSesion(){
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}