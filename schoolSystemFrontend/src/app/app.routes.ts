import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardAlumnoComponent } from './features/alumno/dashboard-alumno/dashboard-alumno.component';
import { NotasAlumnoComponent } from './features/alumno/notas-alumno/notas-alumno.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardDocenteComponent } from './features/docente/dashboard-docente/dashboard-docente.component';
import { NotasDocenteComponent } from './features/docente/notas-docente/notas-docente.component';
import { DashboardAdminComponent } from './features/admin/dashboard-admin/dashboard-admin.component';
import { AdminAlumnosComponent } from './features/admin/admin-alumnos/admin-alumnos.component';
import { AdminAlumnosSeccionComponent } from './features/admin/admin-alumnos-seccion/admin-alumnos-seccion.component';
import { AdminMatriculasComponent } from './features/admin/admin-matriculas/admin-matriculas.component';
import { AdminDocentesComponent } from './features/admin/admin-docentes/admin-docentes.component';
import { AdminAsignacionDocenteComponent } from './features/admin/admin-asignacion-docente/admin-asignacion-docente.component';
import { AdminCursosComponent } from './features/admin/admin-cursos/admin-cursos.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'alumno',
        component: MainLayoutComponent,
        children: [
            { path: '', component: DashboardAlumnoComponent },
            { path: 'notas/:id', component: NotasAlumnoComponent }
        ]
    },
    {
        path: 'docente', 
        component: MainLayoutComponent,
        children: [
            {path: '', component: DashboardDocenteComponent},
            {path: 'curso/:cursoId/seccion/:seccionId', component: NotasDocenteComponent}
        ]
    },
    {
        path: 'admin', 
        component: MainLayoutComponent,
        children: [
            {path: '', component: DashboardAdminComponent},
            {path: 'alumnos', component: AdminAlumnosComponent},
            {path: 'alumnos-seccion', component: AdminAlumnosSeccionComponent},
            {path: 'matriculas', component: AdminMatriculasComponent},
            {path: 'docentes', component: AdminDocentesComponent},
            {path: 'asignacion-docente', component: AdminAsignacionDocenteComponent},
            {path: 'cursos', component: AdminCursosComponent}
        ]
    },
    {
        path: '**',
        redirectTo: 'login' 
    }
];
