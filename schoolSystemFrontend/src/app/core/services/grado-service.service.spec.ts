import { TestBed } from '@angular/core/testing';

import { GradoServiceService } from './grado-service.service';

describe('GradoServiceService', () => {
  let service: GradoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
