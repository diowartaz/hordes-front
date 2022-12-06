import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';
import { updateCustomInventory } from 'src/app/shared/utils/inventory';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  userPlayerCity$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userPlayerData$: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  defaultValues$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  playerLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  getDefaultValues(): Observable<any> {
    let url: string = this.API_URL + 'city/default-values';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('getDefaultValues', response);
        this.defaultValues$.next(response.default_values);
        return response;
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

  // getPlayerCity(): Observable<any> {
  //   let url: string = this.API_URL + 'player/city';
  //   return this.httpClient.get<any>(url).pipe(
  //     map((response: any) => {
  //       this.userPlayerCity$.next(response.city);
  //       return response;
  //     }),
  //     catchError(handleError('getPlayerCity', url))
  //   );
  // }

  new(): Observable<any> {
    let url: string = this.API_URL + 'city/new';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('new', response);
        this.userPlayerCity$.next(response.player.city);
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
        return response;
      }),
      catchError(handleError('findItems', url))
    );
  }

  goToSleep(): Observable<any> {
    let url: string = this.API_URL + 'city/wait';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('goToSleep', response);
        this.userPlayerCity$.next(response.player.city);
        this.userPlayerData$.next(response.player.data);
        return response;
      }),
      catchError(handleError('goToSleep', url))
    );
  }

  build(id: number): Observable<any> {
    let url: string = this.API_URL + 'city/build/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('build', response);
        this.userPlayerCity$.next(response.city);
        return response;
      }),
      catchError(handleError('build', url))
    );
  }

  log(functionName: any, response: any) {
    // return;
    console.log(functionName, 'response', response);
  }
}
