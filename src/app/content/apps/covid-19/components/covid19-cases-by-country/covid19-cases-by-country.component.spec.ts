import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19CasesByCountryComponent } from './covid19-cases-by-country.component';

describe('Covid19CasesByCountryComponent', () => {
  let component: Covid19CasesByCountryComponent;
  let fixture: ComponentFixture<Covid19CasesByCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19CasesByCountryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19CasesByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
