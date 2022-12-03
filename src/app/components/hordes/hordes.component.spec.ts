import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HordesComponent } from './hordes.component';

describe('HordesComponent', () => {
  let component: HordesComponent;
  let fixture: ComponentFixture<HordesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HordesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HordesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
