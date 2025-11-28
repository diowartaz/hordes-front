import { computed, effect, Injectable, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, SignInParams, SignUpParams } from 'src/app/models/auth';
import { RoutesEnum, statesToRoutes, UserState } from 'src/app/models/router';
import { CityService } from '../city/city.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private readonly API_URL = environment.API_URL;

  signInTempLoading = signal(false);
  signInLoading = signal(false);
  signUpLoading = signal(false);
  deleteAccountLoading = signal(false);

  token = signal<string | undefined>(undefined);
  verifiedToken = computed(() => {
    if (!this.token()) {
      return undefined;
    }
    try {
      return this.jwtHelper.isTokenExpired(this.token()!) ? undefined : this.token();
    } catch {
      return undefined;
    }
  });

  isConnected = computed(() => this.verifiedToken() !== undefined);

  userId = computed(() => {
    if (this.verifiedToken() === undefined) {
      return undefined;
    }
    return this.jwtHelper.decodeToken(this.verifiedToken()!)['id'];
  });

  constructor(
    private httpClient: HttpClient,
    private cityService: CityService,
    private router: Router,
  ) {
    this.token.set(localStorage.getItem('token') ?? undefined);
    effect(() => {
      if (this.isConnected() && this.cityService.state() === UserState.NOT_LOADED_PLAYER) {
        this.cityService.loadPlayer();
      }
    });

    effect(() => {
      if (!this.isConnected()) {
        this.router.navigate([RoutesEnum.HOME]);
      }
    });

    effect(() => {
      if (this.isConnected()) {
        this.router.navigate(['/' + statesToRoutes[this.cityService.state()]]);
      }
    });
  }

  signIn(params: SignInParams): Observable<AuthResponse> {
    const url = `${this.API_URL}signin`;
    return this.httpClient.post<AuthResponse>(url, params).pipe(
      tap((result: AuthResponse) => {
        this.handleSucessSignIn(result.token, result.email);
      }),
    );
  }

  signInTemp(): Observable<AuthResponse> {
    const url = `${this.API_URL}signin-temp`;
    return this.httpClient.post<AuthResponse>(url, {}).pipe(
      tap((result: AuthResponse) => {
        this.handleSucessSignIn(result.token, result.email);
      }),
    );
  }

  private handleSucessSignIn(token: string, email: string) {
    this.token.set(token);
    localStorage.setItem('token', token);
    localStorage.setItem('login', email);
  }

  signUp(params: SignUpParams): Observable<AuthResponse> {
    const url = `${this.API_URL}signup`;
    return this.httpClient.post<AuthResponse>(url, params);
  }

  deleteAccount() {
    if (this.deleteAccountLoading()) {
      return;
    }
    this.deleteAccountLoading.set(true);
    const url: string = this.API_URL + 'delete';
    this.httpClient
      .post<any>(url, {})
      .pipe(
        tap(() => {
          this.logOut();
        }),
        finalize(() => {
          this.deleteAccountLoading.set(false);
        }),
      )
      .subscribe();
  }

  logOut() {
    this.token.set(undefined);
    localStorage.removeItem('token');
    this.cityService.state.set(UserState.NOT_LOADED_PLAYER);
  }
}
