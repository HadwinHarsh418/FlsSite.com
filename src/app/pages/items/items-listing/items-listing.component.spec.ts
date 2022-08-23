import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsListingComponent } from './items-listing.component';

describe('ItemsListingComponent', () => {
  let component: ItemsListingComponent;
  let fixture: ComponentFixture<ItemsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
