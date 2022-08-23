import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClpItemComponent } from './review-clp-item.component';

describe('ReviewClpItemComponent', () => {
  let component: ReviewClpItemComponent;
  let fixture: ComponentFixture<ReviewClpItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewClpItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewClpItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
