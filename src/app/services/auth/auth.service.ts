import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, SignInParams, SignUpParams } from 'src/app/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private readonly API_URL = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  userIsLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  parseJwt(): null | Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  getUserId(): string | null {
    const payload = this.parseJwt();
    return payload ? payload['id'] : null;
  }

  signIn(params: SignInParams): Observable<AuthResponse> {
    const url = `${this.API_URL}signin`;
    return this.httpClient.post<AuthResponse>(url, params);
  }

  signInTemp(): Observable<AuthResponse> {
    const url = `${this.API_URL}signin-temp`;
    return this.httpClient.post<AuthResponse>(url, {});
  }

  signUp(params: SignUpParams): Observable<AuthResponse> {
    const url = `${this.API_URL}signup`;
    return this.httpClient.post<AuthResponse>(url, params);
  }

  deleteAccount(): Observable<any> {
    let url: string = this.API_URL + 'delete';
    return this.httpClient.post<any>(url, {})
  }
}
