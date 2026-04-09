import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfiguracionEscolarComponent } from './admin-configuracion-escolar.component';

describe('AdminConfiguracionEscolarComponent', () => {
  let component: AdminConfiguracionEscolarComponent;
  let fixture: ComponentFixture<AdminConfiguracionEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConfiguracionEscolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfiguracionEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
