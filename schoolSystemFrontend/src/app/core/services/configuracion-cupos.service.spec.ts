import { TestBed } from '@angular/core/testing';

import { ConfiguracionCuposService } from './configuracion-cupos.service';

describe('ConfiguracionCuposService', () => {
  let service: ConfiguracionCuposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionCuposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
