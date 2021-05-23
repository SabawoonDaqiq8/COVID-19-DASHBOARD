import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19HistoryWorldComponent } from './covid19-history-world.component';

describe('Covid19HistoryWorldComponent', () => {
  let component: Covid19HistoryWorldComponent;
  let fixture: ComponentFixture<Covid19HistoryWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19HistoryWorldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19HistoryWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
