import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtyComponent } from './fty.component';

describe('FtyComponent', () => {
  let component: FtyComponent;
  let fixture: ComponentFixture<FtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
