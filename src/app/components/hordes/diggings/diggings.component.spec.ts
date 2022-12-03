import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiggingsComponent } from './diggings.component';

describe('DiggingsComponent', () => {
  let component: DiggingsComponent;
  let fixture: ComponentFixture<DiggingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiggingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiggingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
