import { TestBed } from '@angular/core/testing';

import { SeccionServiceService } from './seccion-service.service';

describe('SeccionServiceService', () => {
  let service: SeccionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
