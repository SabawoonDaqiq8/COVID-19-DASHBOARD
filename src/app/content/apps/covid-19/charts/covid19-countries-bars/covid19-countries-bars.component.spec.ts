import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19CountriesBarsComponent } from './covid19-countries-bars.component';

describe('Covid19CountriesBarsComponent', () => {
  let component: Covid19CountriesBarsComponent;
  let fixture: ComponentFixture<Covid19CountriesBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19CountriesBarsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19CountriesBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
