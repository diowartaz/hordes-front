import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { handleError } from 'src/app/general-functions';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

  userIsLoggedIn() {
    let parsedJWT: any = this.parseJwt();
    if (parsedJWT) {
      if (Date.now() >= parsedJWT.exp * 1000) {
        return false;
      } else {
        return true;
      }
      return true;
    } else {
      return false;
    }
  }

  parseJwt() {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = decode(token);
      return tokenPayload;
    } else {
      return null;
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
