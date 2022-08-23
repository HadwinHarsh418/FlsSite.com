import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDetailPermissionComponent } from './sales-detail-permission.component';

describe('SalesDetailPermissionComponent', () => {
  let component: SalesDetailPermissionComponent;
  let fixture: ComponentFixture<SalesDetailPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDetailPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDetailPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
