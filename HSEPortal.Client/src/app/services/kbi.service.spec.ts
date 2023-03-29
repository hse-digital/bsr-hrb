import { TestBed } from '@angular/core/testing';

import { KbiService } from './kbi.service';

describe('KbiService', () => {
  let service: KbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
