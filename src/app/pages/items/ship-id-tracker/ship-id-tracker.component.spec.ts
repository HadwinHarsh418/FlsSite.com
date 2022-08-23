import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipIdTrackerComponent } from './ship-id-tracker.component';

describe('ShipIdTrackerComponent', () => {
  let component: ShipIdTrackerComponent;
  let fixture: ComponentFixture<ShipIdTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipIdTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipIdTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
