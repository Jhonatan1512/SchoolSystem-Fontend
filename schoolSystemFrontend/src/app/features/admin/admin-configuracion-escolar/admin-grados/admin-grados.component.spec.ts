import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGradosComponent } from './admin-grados.component';

describe('AdminGradosComponent', () => {
  let component: AdminGradosComponent;
  let fixture: ComponentFixture<AdminGradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
