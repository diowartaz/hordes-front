import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';
import { updateCustomInventory } from 'src/app/shared/utils/inventory';
import { CityModel, DataModel } from 'src/app/models/hordes';
import { getTimeString } from 'src/app/shared/utils/time';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  userPlayerCity$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userPlayerData$: BehaviorSubject<DataModel | null> =
    new BehaviorSubject<DataModel | null>(null);
  defaultValues$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  playerLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  userPlayerCityTime$: BehaviorSubject<any> = new BehaviorSubject<any>({
    string: '8h00',
    seconds: 8 * 60 * 60,
  });

  setInterval: any = null;

  constructor(private httpClient: HttpClient) {}

  getDefaultValues(): Observable<any> {
    let url: string = this.API_URL + 'city/default-values';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('getDefaultValues', response);
        this.defaultValues$.next(response.default_values);
        // return response;
      }),
      catchError(handleError('getGameXP', url))
    );
  }

  loadPlayer(): Observable<any> {
    let url: string = this.API_URL + 'player';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('loadPlayer', response);
        this.userPlayerData$.next(response.player.data);
        this.userPlayerCity$.next(response.player.city);
        this.defaultValues$.next(response.default_values);
        this.playerLoaded$.next(true);
        this.updateTime(response.player.city);
        return response;
      }),
      catchError(handleError('loadPlayer', url))
    );
  }

  getPlayerData(): Observable<any> {
    let url: string = this.API_URL + 'player/data';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('getPlayerData', response);
        this.userPlayerData$.next(response.data);
        return response;
      }),
      catchError(handleError('getPlayerData', url))
    );
  }

  new(): Observable<any> {
    let url: string = this.API_URL + 'city/new';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('new', response);
        this.userPlayerCity$.next(response.player.city);
        this.updateTime(response.player.city);
        return response;
      }),
      catchError(handleError('new', url))
    );
  }

  delete(): Observable<any> {
    let url: string = this.API_URL + 'city/delete';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('delete', response);
        this.userPlayerCity$.next(null);
        return response;
      }),
      catchError(handleError('delete', url))
    );
  }

  findItems(nb: number): Observable<any> {
    let url: string = this.API_URL + 'city/item/find/' + nb;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('findItems', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('findItems', url))
    );
  }

  build(id: number): Observable<any> {
    let url: string = this.API_URL + 'city/build/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('build', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('build', url))
    );
  }

  learn(id: number): Observable<any> {
    let url: string = this.API_URL + 'city/learn/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('learn', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('learn', url))
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
    let timeToAdd = Math.floor(
      ((new Date().getTime() -
        this.userPlayerCity$.getValue().last_timestamp_request) *
        this.defaultValues$.getValue().coef_realtime_to_ingametime) /
        1000
    );
    if (city.time + timeToAdd > this.defaultValues$.getValue().day_end_time) {
      //fin de journee
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      this.userPlayerCityTime$.next({
        string: getTimeString(this.defaultValues$.getValue().day_end_time),
        seconds: this.defaultValues$.getValue().day_end_time,
      });
      // this.endDay()
      return;
    }
    this.userPlayerCityTime$.next({
      string: getTimeString(city.time + timeToAdd),
      seconds: city.time + timeToAdd,
    });
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
    this.setInterval = setInterval(() => {
      this.addTime();
    }, Math.floor((60 * 1000) / this.defaultValues$.getValue().coef_realtime_to_ingametime));
  }

  addTime() {
    let x = this.userPlayerCityTime$.getValue().seconds + 60;
    if (x >= this.defaultValues$.getValue().day_end_time) {
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      //fin de journee
    } else {
      this.userPlayerCityTime$.next({
        string: getTimeString(x),
        seconds: x,
      });
    }
  }

  endDay(): Observable<any> {
    let url: string = this.API_URL + 'city/day/end';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('endDay', response);
        this.userPlayerCity$.next(response.player.city);
        this.userPlayerData$.next(response.player.data);
        return response;
      }),
      catchError(handleError('endDay', url))
    );
  }

  startDay(): Observable<any> {
    let url: string = this.API_URL + 'city/day/start';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        //city
        this.log('startDay', response);
        this.userPlayerCity$.next(response.city);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('startDay', url))
    );
  }

  getLeaderboardBestDay() {
    let url: string = this.API_URL + 'leaderboard/best-day';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getLeaderboardBestDay', url))
    );
  }
}
