import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocentesComponent } from './admin-docentes.component';

describe('AdminDocentesComponent', () => {
  let component: AdminDocentesComponent;
  let fixture: ComponentFixture<AdminDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
