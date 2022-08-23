import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClpsListingComponent } from './clps-listing.component';

describe('ClpsListingComponent', () => {
  let component: ClpsListingComponent;
  let fixture: ComponentFixture<ClpsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClpsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClpsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
