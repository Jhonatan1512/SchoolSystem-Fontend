import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCuposSeccionComponent } from './admin-cupos-seccion.component';

describe('AdminCuposSeccionComponent', () => {
  let component: AdminCuposSeccionComponent;
  let fixture: ComponentFixture<AdminCuposSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCuposSeccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCuposSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
