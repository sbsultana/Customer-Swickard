import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationRequestFormComponent } from './cancellation-request-form.component';

describe('CancellationRequestFormComponent', () => {
  let component: CancellationRequestFormComponent;
  let fixture: ComponentFixture<CancellationRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
