import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpCustomTagBuilderComponent } from './op-custom-tag-builder.component';

describe('OpCustomTagBuilderComponent', () => {
  let component: OpCustomTagBuilderComponent;
  let fixture: ComponentFixture<OpCustomTagBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpCustomTagBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpCustomTagBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
