import { TestBed } from '@angular/core/testing';

import { AsignacionDocenteService } from './asignacion-docente.service';

describe('AsignacionDocenteService', () => {
  let service: AsignacionDocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionDocenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
