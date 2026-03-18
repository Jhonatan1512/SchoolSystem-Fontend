import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAsignacionDocenteComponent } from './admin-asignacion-docente.component';

describe('AdminAsignacionDocenteComponent', () => {
  let component: AdminAsignacionDocenteComponent;
  let fixture: ComponentFixture<AdminAsignacionDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAsignacionDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAsignacionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
