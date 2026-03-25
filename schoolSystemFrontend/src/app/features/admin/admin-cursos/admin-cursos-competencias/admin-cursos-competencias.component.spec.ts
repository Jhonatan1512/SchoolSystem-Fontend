import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCursosCompetenciasComponent } from './admin-cursos-competencias.component';

describe('AdminCursosCompetenciasComponent', () => {
  let component: AdminCursosCompetenciasComponent;
  let fixture: ComponentFixture<AdminCursosCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCursosCompetenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCursosCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
