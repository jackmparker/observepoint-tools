import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunEntireFolderComponent } from './run-entire-folder.component';

describe('RunEntireFolderComponent', () => {
  let component: RunEntireFolderComponent;
  let fixture: ComponentFixture<RunEntireFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunEntireFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunEntireFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
