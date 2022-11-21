import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

  userIsLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  signIn(params: any): Observable<any> {
    let url: string = this.API_URL + 'signin';
    return this.httpClient.post<any>(url, params).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('signIn', url))
    );
  }

  signUp(params: any): Observable<any> {
    let url: string = this.API_URL + 'signup';
    return this.httpClient.post<any>(url, params).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('signUp', url))
    );
  }
}
