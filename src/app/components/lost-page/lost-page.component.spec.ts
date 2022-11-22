import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPageComponent } from './lost-page.component';

describe('LostPageComponent', () => {
  let component: LostPageComponent;
  let fixture: ComponentFixture<LostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LostPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
