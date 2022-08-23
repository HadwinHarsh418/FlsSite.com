import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoClpsComponent } from './info-clps.component';

describe('InfoClpsComponent', () => {
  let component: InfoClpsComponent;
  let fixture: ComponentFixture<InfoClpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoClpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoClpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
