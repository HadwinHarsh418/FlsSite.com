import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPermissionComponent } from './sales-permission.component';

describe('SalesPermissionComponent', () => {
  let component: SalesPermissionComponent;
  let fixture: ComponentFixture<SalesPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
