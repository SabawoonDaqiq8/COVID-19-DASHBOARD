import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19CasesWorldwideComponent } from './covid19-cases-worldwide.component';

describe('Covid19CasesWorldwideComponent', () => {
  let component: Covid19CasesWorldwideComponent;
  let fixture: ComponentFixture<Covid19CasesWorldwideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19CasesWorldwideComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19CasesWorldwideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
