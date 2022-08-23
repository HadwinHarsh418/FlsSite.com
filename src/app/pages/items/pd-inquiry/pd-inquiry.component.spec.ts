import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdInquiryComponent } from './pd-inquiry.component';

describe('PdInquiryComponent', () => {
  let component: PdInquiryComponent;
  let fixture: ComponentFixture<PdInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
