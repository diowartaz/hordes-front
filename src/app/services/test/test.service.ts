import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  API_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

  getCatFacts(): Observable<any> {
    let url: string = 'https://catfact.ninja/fact';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getCatFacts', url))
    );
  }

  getXP(): Observable<any> {
    let url: string = this.API_URL + 'user/xp';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getXP', url))
    );
  }
}
