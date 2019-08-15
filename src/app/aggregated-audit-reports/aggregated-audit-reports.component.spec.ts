import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedAuditReportsComponent } from './aggregated-audit-reports.component';

describe('AggregatedAuditReportsComponent', () => {
  let component: AggregatedAuditReportsComponent;
  let fixture: ComponentFixture<AggregatedAuditReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatedAuditReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregatedAuditReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
