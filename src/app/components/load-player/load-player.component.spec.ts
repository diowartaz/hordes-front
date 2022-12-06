import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPlayerComponent } from './load-player.component';

describe('LoadPlayerComponent', () => {
  let component: LoadPlayerComponent;
  let fixture: ComponentFixture<LoadPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
