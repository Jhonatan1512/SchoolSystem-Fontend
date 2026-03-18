import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMatriculasComponent } from './admin-matriculas.component';

describe('AdminMatriculasComponent', () => {
  let component: AdminMatriculasComponent;
  let fixture: ComponentFixture<AdminMatriculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMatriculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
