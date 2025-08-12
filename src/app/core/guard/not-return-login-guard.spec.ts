import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notReturnLoginGuard } from './not-return-login-guard';

describe('notReturnLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notReturnLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
