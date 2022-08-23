import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyClpItemsComponent } from './daily-clp-items.component';

describe('DailyClpItemsComponent', () => {
  let component: DailyClpItemsComponent;
  let fixture: ComponentFixture<DailyClpItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyClpItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyClpItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
