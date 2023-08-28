import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliveRecapComponent } from './alive-recap.component';

describe('AliveRecapComponent', () => {
  let component: AliveRecapComponent;
  let fixture: ComponentFixture<AliveRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AliveRecapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliveRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
