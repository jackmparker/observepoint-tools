import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDeleteTableComponent } from './bulk-delete-table.component';

describe('BulkDeleteTableComponent', () => {
  let component: BulkDeleteTableComponent;
  let fixture: ComponentFixture<BulkDeleteTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDeleteTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDeleteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
