import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCronogramaComponent } from './admin-cronograma.component';

describe('AdminCronogramaComponent', () => {
  let component: AdminCronogramaComponent;
  let fixture: ComponentFixture<AdminCronogramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCronogramaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCronogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
