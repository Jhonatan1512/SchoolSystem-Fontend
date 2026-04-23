import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaDocenteComponent } from './cuenta-docente.component';

describe('CuentaDocenteComponent', () => {
  let component: CuentaDocenteComponent;
  let fixture: ComponentFixture<CuentaDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
