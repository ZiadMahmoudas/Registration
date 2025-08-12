import { TestBed } from '@angular/core/testing';

import { TokenServices } from './TokenServices';

describe('BrowserStorage', () => {
  let service: TokenServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
