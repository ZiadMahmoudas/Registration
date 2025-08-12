import { TestBed } from '@angular/core/testing';

import { ItemsServices } from './items-services';

describe('ItemsServices', () => {
  let service: ItemsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
