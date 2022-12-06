import { TestBed } from '@angular/core/testing';

import { GameLoadedGuard } from './game-loaded.guard';

describe('GameLoadedGuard', () => {
  let guard: GameLoadedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GameLoadedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
