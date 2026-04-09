import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeccionesComponent } from './admin-secciones.component';

describe('AdminSeccionesComponent', () => {
  let component: AdminSeccionesComponent;
  let fixture: ComponentFixture<AdminSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
