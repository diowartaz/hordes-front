import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { handleError } from 'src/app/shared/utils/general-functions';
import { environment } from 'src/environments/environment';
import { BonusWithoutLvl, createDefaultStatsModel, StatsModel } from 'src/app/models/hordes';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { UserState } from 'src/app/models/router';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  userPlayerCity$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userPlayerStats$: BehaviorSubject<StatsModel> = new BehaviorSubject<StatsModel>(createDefaultStatsModel());
  defaultValues$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userPlayerState$: BehaviorSubject<UserState> = new BehaviorSubject<UserState>(UserState.NOT_LOADED_PLAYER);
  playerLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  userPlayerCityTime$: BehaviorSubject<any> = new BehaviorSubject<any>({
    string: '8h00',
    seconds: 8 * 60 * 60,
  });

  referencesBonuses$: BehaviorSubject<BonusWithoutLvl[]> = new BehaviorSubject<BonusWithoutLvl[]>([]);

  setInterval: any = null;

  constructor(private httpClient: HttpClient) {}

  loadPlayer(): Observable<any> {
    const url: string = this.API_URL + 'player';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        //console.log('state', response.player.state);
        //TODO: if erreur: vider le local storage
        this.log('loadPlayer', response);
        this.userPlayerState$.next(response.player.state);
        this.userPlayerStats$.next(response.player.stats);
        this.userPlayerCity$.next(response.player.city);
        this.defaultValues$.next(response.default_values);
        this.updateTime(response.player.city);
        this.playerLoaded$.next(true);
        return response;
      }),
      catchError(handleError('loadPlayer', url)),
    );
  }

  getPlayerStats(): Observable<any> {
    const url: string = this.API_URL + 'player/stats';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('getPlayerStats', response);
        this.userPlayerStats$.next(response.stats);
        return response;
      }),
      catchError(handleError('getPlayerStats', url)),
    );
  }

  new(ranked: boolean): Observable<any> {
    const url: string = this.API_URL + 'city/new/';
    return this.httpClient.post<any>(url, { ranked }).pipe(
      map((response: any) => {
        this.log('new', response);
        this.userPlayerCity$.next(response.player.city);
        this.userPlayerState$.next(response.player.state);
        this.updateTime(response.player.city);
        return response;
      }),
      catchError(handleError('new', url)),
    );
  }

  delete(): Observable<any> {
    const url: string = this.API_URL + 'city/delete';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('delete', response);
        this.userPlayerCity$.next(null);
        this.userPlayerState$.next(UserState.NO_CITY);
        return response;
      }),
      catchError(handleError('delete', url)),
    );
  }

  findItems(nb: number): Observable<any> {
    const url: string = this.API_URL + 'city/item/find/' + nb;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('findItems', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('findItems', url)),
    );
  }

  build(id: number): Observable<any> {
    const url: string = this.API_URL + 'city/build/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('build', response);
        this.updateTime(response.city);
        this.userPlayerCity$.next(response.city);
        return response;
      }),
      catchError(handleError('build', url)),
    );
  }

  learn(id: number): Observable<any> {
    const url: string = this.API_URL + 'city/learn/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('learn', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('learn', url)),
    );
  }

  log(functionName: string, response: any) {
    return;
    console.log(functionName, 'response', response);
  }

  updateTime(city: any) {
    if (!this.userPlayerCity$.getValue()) {
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      return;
    }
    const timeToAdd = Math.floor(
      ((new Date().getTime() - this.userPlayerCity$.getValue().last_timestamp_request) *
        this.defaultValues$.getValue().coef_realtime_to_ingametime) /
        1000,
    );
    if (city.time + timeToAdd > this.defaultValues$.getValue().day_end_time) {
      //fin de journee
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      this.userPlayerCityTime$.next({
        string: formatTimeToString(this.defaultValues$.getValue().day_end_time, true),
        seconds: this.defaultValues$.getValue().day_end_time,
      });
      // this.endDay()
      return;
    }
    this.userPlayerCityTime$.next({
      string: formatTimeToString(city.time + timeToAdd, true),
      seconds: city.time + timeToAdd,
    });
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
    this.setInterval = setInterval(
      () => {
        this.addTime();
      },
      Math.floor((60 * 1000) / this.defaultValues$.getValue().coef_realtime_to_ingametime),
    );
  }

  addTime() {
    const x = this.userPlayerCityTime$.getValue().seconds + 60;
    if (x >= this.defaultValues$.getValue().day_end_time) {
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      //fin de journee
    } else {
      this.userPlayerCityTime$.next({
        string: formatTimeToString(x, true),
        seconds: x,
      });
    }
  }

  endDay(): Observable<any> {
    const url: string = this.API_URL + 'city/day/end';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('endDay', response);
        this.userPlayerCity$.next(response.player.city);
        this.userPlayerStats$.next(response.player.stats);
        this.userPlayerState$.next(response.player.state);
        return response;
      }),
      catchError(handleError('endDay', url)),
    );
  }

  startDay(whatAreTheSelectedBuildings: number[]): Observable<any> {
    const url: string = this.API_URL + 'city/day/start';
    return this.httpClient.post<any>(url, { chosen_buildings: whatAreTheSelectedBuildings }).pipe(
      map((response: any) => {
        //city
        this.log('startDay', response);
        this.userPlayerCity$.next(response.city);
        this.userPlayerState$.next(UserState.PLAYING);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('startDay', url)),
    );
  }

  getLeaderboardBestDay() {
    const url: string = this.API_URL + 'leaderboard/best-day';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getLeaderboardBestDay', url)),
    );
  }

  getLeaderboardRanked() {
    const url: string = this.API_URL + 'leaderboard/ranked';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getLeaderboardRanked', url)),
    );
  }

  getProfil(id: string) {
    const url: string = this.API_URL + 'profil/' + id;
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getProfil', url)),
    );
  }

  loadReferencesBonuses(): void {
    const url = this.API_URL + 'references/bonuses';
    this.httpClient
      .get<{ bonuses: BonusWithoutLvl[] }>(url)
      .pipe(
        tap((response) => this.referencesBonuses$.next(response.bonuses)),
        catchError(handleError('loadReferencesBonuses', url)),
      )
      .subscribe();
  }

  buyBonus(id: number): void {
    const url: string = this.API_URL + 'player/bonuses/buy/' + id;
    this.httpClient
      .post<any>(url, {})
      .pipe(
        tap((response) => this.userPlayerStats$.next(response.stats)),
        catchError(handleError('buyBonus', url)),
      )
      .subscribe();
  }
}
