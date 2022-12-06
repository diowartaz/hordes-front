import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCityStartedComponent } from './no-city-started.component';

describe('NoCityStartedComponent', () => {
  let component: NoCityStartedComponent;
  let fixture: ComponentFixture<NoCityStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCityStartedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCityStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
