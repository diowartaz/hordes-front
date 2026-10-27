import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { components } from 'src/app/models/api';

import { LeaderboardComponent } from './leaderboard.component';

type Entry = components['schemas']['LeaderboardEntryResponse'];

const entry = (rank: number): Entry => ({
  rank,
  playerId: `p${rank}`,
  username: `player${rank}`,
  bestDay: 100 - rank,
  bestZombies: 0,
  rankedPoints: 1000 - rank,
});

const response = (page: number, count: number, total: number): components['schemas']['LeaderboardResponse'] => ({
  entries: Array.from({ length: count }, (_, i) => entry((page - 1) * 25 + i + 1)),
  page,
  pageSize: 25,
  total,
  leader: total > 0 ? entry(1) : null,
});

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let http: HttpTestingController;
  const queryParams = new BehaviorSubject(convertToParamMap({}));

  const flushPage = async (url: string, body: components['schemas']['LeaderboardResponse']) => {
    TestBed.tick();
    http.expectOne((request) => request.urlWithParams.endsWith(url)).flush(body);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    queryParams.next(convertToParamMap({}));
    await TestBed.configureTestingModule({
      imports: [LeaderboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParams } },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('affiche le podium et le reste de la première page', async () => {
    await flushPage('leaderboards/best-day?page=1', response(1, 25, 60));
    expect(component.podium().map((user) => user.rank)).toEqual([2, 1, 3]);
    expect(component.others().length).toBe(22);
    expect(component.lastPage()).toBe(3);
    expect(component.pages()).toEqual([1, 2, 3]);
  });

  it('suit la page et l’onglet de l’URL, sans podium au-delà de la première page', async () => {
    await flushPage('leaderboards/best-day?page=1', response(1, 25, 60));
    queryParams.next(convertToParamMap({ ranked: 'true', page: '3' }));
    await flushPage('leaderboards/ranked?page=3', response(3, 10, 60));

    expect(component.podium()).toEqual([]);
    expect(component.others().map((user) => user.rank)).toEqual([51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);
    // Jauges relatives au premier du classement, pas au premier de la page
    expect(component.ratioOf(component.others()[0])).toBe(Math.round((949 / 999) * 100));
  });

  it('ignore une page invalide dans l’URL', async () => {
    queryParams.next(convertToParamMap({ page: 'abc' }));
    await flushPage('leaderboards/best-day?page=1', response(1, 0, 0));
    expect(component.currentPage()).toBe(1);
    expect(component.lastPage()).toBe(0);
  });
});
