import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOffer } from './display-offer';

describe('DisplayOffer', () => {
  let component: DisplayOffer;
  let fixture: ComponentFixture<DisplayOffer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayOffer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayOffer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
