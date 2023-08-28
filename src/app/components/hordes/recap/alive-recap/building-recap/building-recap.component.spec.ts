import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingRecapComponent } from './building-recap.component';

describe('BuildingRecapComponent', () => {
  let component: BuildingRecapComponent;
  let fixture: ComponentFixture<BuildingRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingRecapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
