import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioAlumnoComponent } from './horario-alumno.component';

describe('HorarioAlumnoComponent', () => {
  let component: HorarioAlumnoComponent;
  let fixture: ComponentFixture<HorarioAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
