import { TestBed } from '@angular/core/testing';

import { Valorant } from './valorant';

describe('Valorant', () => {
  let service: Valorant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Valorant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
