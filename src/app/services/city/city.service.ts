import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  userGameCity$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  userGameXp$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  constructor(private httpClient: HttpClient) {}

  getGameXP(): Observable<any> {
    let url: string = this.API_URL + 'game/xp';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        console.log(' getGameXP response.xp', response.xp);
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
        console.log(' getGameCity response.city', response.city);
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
}
