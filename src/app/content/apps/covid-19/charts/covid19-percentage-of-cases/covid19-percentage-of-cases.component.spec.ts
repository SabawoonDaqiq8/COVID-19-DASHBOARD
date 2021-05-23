import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19PercentageOfCasesComponent } from './covid19-percentage-of-cases.component';

describe('Covid19PercentageOfCasesComponent', () => {
  let component: Covid19PercentageOfCasesComponent;
  let fixture: ComponentFixture<Covid19PercentageOfCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19PercentageOfCasesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19PercentageOfCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
