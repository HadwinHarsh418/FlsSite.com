import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfOperationComponent } from './pdf-operation.component';

describe('PdfOperationComponent', () => {
  let component: PdfOperationComponent;
  let fixture: ComponentFixture<PdfOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
