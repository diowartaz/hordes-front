import { TestBed } from '@angular/core/testing';

import { CityNotNullGuard } from './city-not-null.guard';

describe('CityNotNullGuard', () => {
  let guard: CityNotNullGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CityNotNullGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
