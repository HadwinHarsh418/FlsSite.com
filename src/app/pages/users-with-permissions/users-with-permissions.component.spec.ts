import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWithPermissionsComponent } from './users-with-permissions.component';

describe('UsersWithPermissionsComponent', () => {
  let component: UsersWithPermissionsComponent;
  let fixture: ComponentFixture<UsersWithPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersWithPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWithPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
