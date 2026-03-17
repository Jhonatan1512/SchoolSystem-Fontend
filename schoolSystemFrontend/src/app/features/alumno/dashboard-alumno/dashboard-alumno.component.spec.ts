import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlumnoComponent } from './dashboard-alumno.component';

describe('DashboardAlumnoComponent', () => {
  let component: DashboardAlumnoComponent;
  let fixture: ComponentFixture<DashboardAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
