import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19RecoveryRatioComponent } from './covid19-recovery-ratio.component';

describe('Covid19RecoveryRatioComponent', () => {
  let component: Covid19RecoveryRatioComponent;
  let fixture: ComponentFixture<Covid19RecoveryRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19RecoveryRatioComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19RecoveryRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
