import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19WorldMapComponent } from './covid19-world-map.component';

describe('Covid19WorldMapComponent', () => {
  let component: Covid19WorldMapComponent;
  let fixture: ComponentFixture<Covid19WorldMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Covid19WorldMapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19WorldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
