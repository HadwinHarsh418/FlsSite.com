import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryQueueComponent } from './inventory-queue.component';

describe('InventoryQueueComponent', () => {
  let component: InventoryQueueComponent;
  let fixture: ComponentFixture<InventoryQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
