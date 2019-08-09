import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BearerTokenGeneratorComponent } from './bearer-token-generator.component';

describe('BearerTokenGeneratorComponent', () => {
  let component: BearerTokenGeneratorComponent;
  let fixture: ComponentFixture<BearerTokenGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BearerTokenGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BearerTokenGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
