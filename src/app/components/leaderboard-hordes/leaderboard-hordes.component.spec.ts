import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardHordesComponent } from './leaderboard-hordes.component';

describe('LeaderboardHordesComponent', () => {
  let component: LeaderboardHordesComponent;
  let fixture: ComponentFixture<LeaderboardHordesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardHordesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardHordesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
