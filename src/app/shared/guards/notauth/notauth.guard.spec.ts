import { TestBed } from '@angular/core/testing';

import { NotauthGuard } from './notauth.guard';

describe('NotauthGuard', () => {
  let guard: NotauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
