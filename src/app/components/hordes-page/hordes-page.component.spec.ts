import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HordesPageComponent } from './hordes-page.component';

describe('HordesPageComponent', () => {
  let component: HordesPageComponent;
  let fixture: ComponentFixture<HordesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HordesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HordesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
