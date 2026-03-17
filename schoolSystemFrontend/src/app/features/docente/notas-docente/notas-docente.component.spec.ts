import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasDocenteComponent } from './notas-docente.component';

describe('NotasDocenteComponent', () => {
  let component: NotasDocenteComponent;
  let fixture: ComponentFixture<NotasDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
