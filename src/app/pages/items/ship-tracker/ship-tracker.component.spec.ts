import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipTrackerComponent } from './ship-tracker.component';

describe('ShipTrackerComponent', () => {
  let component: ShipTrackerComponent;
  let fixture: ComponentFixture<ShipTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
