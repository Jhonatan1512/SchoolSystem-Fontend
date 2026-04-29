import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJornadasComponent } from './admin-jornadas.component';

describe('AdminJornadasComponent', () => {
  let component: AdminJornadasComponent;
  let fixture: ComponentFixture<AdminJornadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJornadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminJornadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
