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
  userGameCity$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userGameXp$: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  defaultValues$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  gameLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  getDefaultValues(): Observable<any> {
    let url: string = this.API_URL + 'city/default-values';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.defaultValues$.next(response.default_values);
        return response;
      }),
      catchError(handleError('getGameXP', url))
    );
  }

  loadGame(): Observable<any> {
    let url: string = this.API_URL + 'game';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.userGameXp$.next(response.game.xp);
        this.userGameCity$.next(response.game.city);
        this.defaultValues$.next(response.default_values);
        this.gameLoaded$.next(true);
        return response;
      }),
      catchError(handleError('loadGame', url))
    );
  }

  getGameXP(): Observable<any> {
    let url: string = this.API_URL + 'game/xp';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.userGameXp$.next(response.xp);
        return response;
      }),
      catchError(handleError('getGameXP', url))
    );
  }

  getGameCity(): Observable<any> {
    let url: string = this.API_URL + 'game/city';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.userGameCity$.next(response.city);
        return response;
      }),
      catchError(handleError('getGameXP', url))
    );
  }

  new(): Observable<any> {
    let url: string = this.API_URL + 'city/new';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.userGameCity$.next(response.game.city);
        return response;
      }),
      catchError(handleError('new', url))
    );
  }

  delete(): Observable<any> {
    let url: string = this.API_URL + 'city/delete';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.userGameCity$.next(null);
        return response;
      }),
      catchError(handleError('delete', url))
    );
  }

  findItems(nb: number): Observable<any> {
    let url: string = this.API_URL + 'city/item/find/' + nb;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.userGameCity$.next(response.city);
        return response;
      }),
      catchError(handleError('findItems', url))
    );
  }

  goToSleep(): Observable<any> {
    let url: string = this.API_URL + 'city/wait';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.userGameCity$.next(response.city);
        this.userGameXp$.next(response.xp);
        return response;
      }),
      catchError(handleError('goToSleep', url))
    );
  }

  build(id: number): Observable<any> {
    let url: string = this.API_URL + 'city/build/' + id;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.userGameCity$.next(response.city);
        return response;
      }),
      catchError(handleError('build', url))
    );
  }
}
