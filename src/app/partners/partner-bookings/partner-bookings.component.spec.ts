import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerBookingsComponent } from './partner-bookings.component';

describe('PartnerBookingsComponent', () => {
  let component: PartnerBookingsComponent;
  let fixture: ComponentFixture<PartnerBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerBookingsComponent]
    });
    fixture = TestBed.createComponent(PartnerBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
