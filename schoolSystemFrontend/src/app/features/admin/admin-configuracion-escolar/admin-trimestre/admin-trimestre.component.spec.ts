import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrimestreComponent } from './admin-trimestre.component';

describe('AdminTrimestreComponent', () => {
  let component: AdminTrimestreComponent;
  let fixture: ComponentFixture<AdminTrimestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrimestreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTrimestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
