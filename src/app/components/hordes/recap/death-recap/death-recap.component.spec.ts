import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathRecapComponent } from './death-recap.component';

describe('DeathRecapComponent', () => {
  let component: DeathRecapComponent;
  let fixture: ComponentFixture<DeathRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeathRecapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeathRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
