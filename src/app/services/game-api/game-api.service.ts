import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CityResponse,
  EndDayResponse,
  FindItemsResponse,
  LeaderboardResponse,
  LoadPlayerResponse,
  NewCityResponse,
  ProfilResponse,
  ReferencesBonusesResponse,
  StatsResponse,
} from 'src/app/models/hordes';
import { environment } from 'src/environments/environment';

// Appels HTTP typés vers l'API du jeu, sans état ni effet de bord
@Injectable({ providedIn: 'root' })
export class GameApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  loadPlayer(): Observable<LoadPlayerResponse> {
    return this.httpClient.get<LoadPlayerResponse>(this.API_URL + 'player');
  }

  findItems(nb: number): Observable<FindItemsResponse> {
    return this.httpClient.post<FindItemsResponse>(this.API_URL + 'city/item/find/' + nb, {});
  }

  newCity(ranked: boolean): Observable<NewCityResponse> {
    return this.httpClient.post<NewCityResponse>(this.API_URL + 'city/new/', { ranked });
  }

  deleteCity(): Observable<unknown> {
    return this.httpClient.post(this.API_URL + 'city/delete', {});
  }

  build(id: number): Observable<CityResponse> {
    return this.httpClient.post<CityResponse>(this.API_URL + 'city/build/' + id, {});
  }

  learn(id: number): Observable<CityResponse> {
    return this.httpClient.post<CityResponse>(this.API_URL + 'city/learn/' + id, {});
  }

  endDay(): Observable<EndDayResponse> {
    return this.httpClient.post<EndDayResponse>(this.API_URL + 'city/day/end', {});
  }

  startDay(chosenBuildings: number[]): Observable<CityResponse> {
    return this.httpClient.post<CityResponse>(this.API_URL + 'city/day/start', { chosen_buildings: chosenBuildings });
  }

  buyBonus(id: number): Observable<StatsResponse> {
    return this.httpClient.post<StatsResponse>(this.API_URL + 'player/bonuses/buy/' + id, {});
  }

  getReferencesBonuses(): Observable<ReferencesBonusesResponse> {
    return this.httpClient.get<ReferencesBonusesResponse>(this.API_URL + 'references/bonuses');
  }

  getLeaderboardBestDay(): Observable<LeaderboardResponse> {
    return this.httpClient.get<LeaderboardResponse>(this.API_URL + 'leaderboard/best-day');
  }

  getLeaderboardRanked(): Observable<LeaderboardResponse> {
    return this.httpClient.get<LeaderboardResponse>(this.API_URL + 'leaderboard/ranked');
  }

  getProfil(id: string): Observable<ProfilResponse> {
    return this.httpClient.get<ProfilResponse>(this.API_URL + 'profil/' + id);
  }
}
