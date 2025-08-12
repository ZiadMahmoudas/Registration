import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { dashboardGuard } from './dashboard-guard';

describe('dashboardGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dashboardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
