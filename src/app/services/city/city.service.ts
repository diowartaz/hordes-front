import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

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
        return response;
      }),
      catchError(handleError('delete', url))
    );
  }

  findItems(nb: number): Observable<any> {
    let url: string = this.API_URL + 'city/item/find/' + nb;
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('findItems', url))
    );
  }

  goToSleep(nb: number): Observable<any> {
    let url: string = this.API_URL + 'city/wait';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('goToSleep', url))
    );
  }
}
