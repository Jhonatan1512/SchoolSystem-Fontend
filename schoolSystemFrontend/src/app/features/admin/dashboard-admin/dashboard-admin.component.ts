import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dashboard-admin',
  imports: [ CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  public monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

  public days: (number | null)[] = [];
  public dateFocus = new Date();
  public currentDay = new Date().getDate();
  public currentMonth = new Date().getMonth();
  public currentYear = new Date().getFullYear();

  ngOnInit() {
      this.generarCalendario();
  }

  generarCalendario(){
    this.days = [];
    const year = this.dateFocus.getFullYear();
    const month = this.dateFocus.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDate();
    const adjFirstDayInde = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const dayInMonth = new Date(year, month + 1, 0).getDate();

    for(let i = 0; i < adjFirstDayInde; i++) {
      this.days.push(null);
    }

    for(let i = 0; i <= dayInMonth; i++){
      this.days.push(i);
    }
  }

  cambiarMes(ofsset: number){
    this.dateFocus.setMonth(this.dateFocus.getMonth() + ofsset);
    this.dateFocus = new Date(this.dateFocus);
    this.generarCalendario();
  }

  esHoy(day: number | null): boolean {
    if(!day) return false;
    const today = new Date();
    return day === today.getDate() &&
      this.dateFocus.getMonth() === today.getMonth() && 
      this.dateFocus.getFullYear() === today.getFullYear();
  }
} 
