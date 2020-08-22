import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyJourneyComponent } from './copy-journey.component';

describe('CopyJourneyComponent', () => {
  let component: CopyJourneyComponent;
  let fixture: ComponentFixture<CopyJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
