import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtyNotesComponent } from './fty-notes.component';

describe('FtyNotesComponent', () => {
  let component: FtyNotesComponent;
  let fixture: ComponentFixture<FtyNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtyNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
