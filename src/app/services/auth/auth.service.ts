import { computed, Injectable, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, SignInParams, SignUpParams } from 'src/app/models/auth';
import { UserState } from 'src/app/models/router';
import { CityService } from '../city/city.service';

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
  email = signal<string | undefined>(undefined);
  tempAccount = computed(() => {
    if (this.email()) {
      if (this.email()!.split('@')[1] === 'temp.com') {
        return true;
      }
    }
    return false;
  });
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
  ) {
    this.token.set(localStorage.getItem('token') ?? undefined);
    this.email.set(localStorage.getItem('login') ?? undefined);
  }

  signIn(params: SignInParams): Observable<AuthResponse> {
    const url = `${this.API_URL}signin`;
    return this.httpClient.post<AuthResponse>(url, params).pipe(
      tap((result: AuthResponse) => {
        this.handleSucessSignIn(result.token, result.email);
      }),
    );
  }

  signInTemp(): void {
    const url = `${this.API_URL}signin-temp`;
    this.httpClient
      .post<AuthResponse>(url, {})
      .pipe(
        tap((result: AuthResponse) => {
          this.handleSucessSignIn(result.token, result.email);
        }),
      )
      .subscribe();
  }

  private handleSucessSignIn(token: string, email: string) {
    this.token.set(token);
    this.email.set(email);
    localStorage.setItem('token', token);
    localStorage.setItem('login', email);
  }

  signUp(params: SignUpParams): Observable<
    | AuthResponse
    | {
        error: {
          emailAlreadyExists: boolean;
          usernameAlreadyExists: boolean;
        };
      }
  > {
    const url = `${this.API_URL}signup`;
    return this.httpClient
      .post<
        | AuthResponse
        | {
            error: {
              emailAlreadyExists: boolean;
              usernameAlreadyExists: boolean;
            };
          }
      >(url, params)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return new Observable<any>((subscriber) => {
              subscriber.next({ error: error.error.error });
              subscriber.complete();
            });
          }
          return throwError(() => error);
        }),
      );
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
