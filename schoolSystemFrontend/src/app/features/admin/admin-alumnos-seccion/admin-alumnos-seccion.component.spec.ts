import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAlumnosSeccionComponent } from './admin-alumnos-seccion.component';

describe('AdminAlumnosSeccionComponent', () => {
  let component: AdminAlumnosSeccionComponent;
  let fixture: ComponentFixture<AdminAlumnosSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAlumnosSeccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAlumnosSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
