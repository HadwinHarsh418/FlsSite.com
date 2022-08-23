import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesslogsComponent } from './accesslogs.component';

describe('AccesslogsComponent', () => {
  let component: AccesslogsComponent;
  let fixture: ComponentFixture<AccesslogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesslogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesslogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
