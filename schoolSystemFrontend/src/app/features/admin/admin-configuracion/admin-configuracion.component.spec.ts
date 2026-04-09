import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfiguracionComponent } from './admin-configuracion.component';

describe('AdminConfiguracionComponent', () => {
  let component: AdminConfiguracionComponent;
  let fixture: ComponentFixture<AdminConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConfiguracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
