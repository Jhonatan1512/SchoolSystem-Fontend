import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteLibretasComponent } from './docente-libretas.component';

describe('DocenteLibretasComponent', () => {
  let component: DocenteLibretasComponent;
  let fixture: ComponentFixture<DocenteLibretasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteLibretasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteLibretasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
