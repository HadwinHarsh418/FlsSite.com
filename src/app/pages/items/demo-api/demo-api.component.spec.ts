import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoApiComponent } from './demo-api.component';

describe('DemoApiComponent', () => {
  let component: DemoApiComponent;
  let fixture: ComponentFixture<DemoApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
