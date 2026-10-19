import { computed, Injectable, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AuthResponse,
  ChangePasswordParams,
  JwtPayload,
  SignInParams,
  SignUpParams,
  UpgradeAccountParams,
} from 'src/app/models/auth';
import { UserState } from 'src/app/models/router';
import { CityService } from '../city/city.service';
import { getAuthErrorMessage } from 'src/app/shared/utils/auth-errors';

const TOKEN_KEY = 'token';
const TEMP_ACCOUNT_KEY = 'temp-account';
// Dernier identifiant utilisé, pour pré-remplir le formulaire de connexion
const LOGIN_KEY = 'login';

// Anciens comptes invités en @temp.com, nouveaux en @temp.invalid
const isTempEmail = (email: string | null): boolean => !!email && /@temp\.(com|invalid)$/.test(email);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private readonly API_URL = environment.API_URL;

  signInTempLoading = signal(false);
  signInTempError = signal<string | undefined>(undefined);
  deleteAccountLoading = signal(false);

  token = signal<string | undefined>(undefined);
  tempAccount = signal(false);

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

  private payload = computed(() => {
    const token = this.verifiedToken();
    return token ? this.jwtHelper.decodeToken<JwtPayload>(token) : undefined;
  });
  userId = computed(() => this.payload()?.id);
  username = computed(() => this.payload()?.username);

  constructor(
    private httpClient: HttpClient,
    private cityService: CityService,
  ) {
    this.token.set(localStorage.getItem(TOKEN_KEY) ?? undefined);

    const savedLogin = localStorage.getItem(LOGIN_KEY);
    const savedTempAccount = localStorage.getItem(TEMP_ACCOUNT_KEY);
    // Sessions ouvertes avant l'ajout de isTemporary : on se base sur le domaine de l'email
    this.tempAccount.set(savedTempAccount === null ? isTempEmail(savedLogin) : savedTempAccount === 'true');
    if (isTempEmail(savedLogin)) {
      localStorage.removeItem(LOGIN_KEY);
    }
  }

  get savedLogin(): string {
    return localStorage.getItem(LOGIN_KEY) ?? '';
  }

  signIn(params: SignInParams): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}signin`, params)
      .pipe(tap((result) => this.handleAuthSuccess(result, params.login)));
  }

  signInTemp(): void {
    if (this.signInTempLoading()) {
      return;
    }
    this.signInTempLoading.set(true);
    this.signInTempError.set(undefined);
    this.httpClient
      .post<AuthResponse>(`${this.API_URL}signin-temp`, {})
      .pipe(
        finalize(() => {
          this.signInTempLoading.set(false);
        }),
      )
      .subscribe({
        next: (result) => this.handleAuthSuccess(result),
        error: (error) => this.signInTempError.set(getAuthErrorMessage(error)),
      });
  }

  /**
   * Le back renvoie un token à l'inscription : l'utilisateur est connecté directement
   */
  signUp(params: SignUpParams): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}signup`, params)
      .pipe(tap((result) => this.handleAuthSuccess(result, params.email)));
  }

  /**
   * Convertit le compte invité en compte classique (le back révoque l'ancien token et en renvoie un nouveau)
   */
  upgradeAccount(params: UpgradeAccountParams): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}upgrade`, params)
      .pipe(tap((result) => this.handleAuthSuccess(result, params.email)));
  }

  /**
   * Les autres sessions sont révoquées : le back renvoie un nouveau token pour la session courante
   */
  changePassword(params: ChangePasswordParams): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}password`, params)
      .pipe(tap((result) => this.handleAuthSuccess(result)));
  }

  logOutAll(): Observable<unknown> {
    return this.httpClient.post(`${this.API_URL}logout-all`, {}).pipe(tap(() => this.logOut()));
  }

  /**
   * @param password requis sauf pour un compte invité
   */
  deleteAccount(password?: string): Observable<unknown> {
    this.deleteAccountLoading.set(true);
    return this.httpClient.delete(`${this.API_URL}account`, { body: password ? { password } : {} }).pipe(
      tap(() => {
        localStorage.removeItem(LOGIN_KEY);
        this.logOut();
      }),
      finalize(() => {
        this.deleteAccountLoading.set(false);
      }),
    );
  }

  private handleAuthSuccess(result: AuthResponse, login?: string): void {
    this.token.set(result.token);
    this.tempAccount.set(result.isTemporary);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(TEMP_ACCOUNT_KEY, String(result.isTemporary));
    if (!result.isTemporary) {
      localStorage.setItem(LOGIN_KEY, login ?? result.email);
    }
  }

  logOut(): void {
    this.token.set(undefined);
    this.tempAccount.set(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TEMP_ACCOUNT_KEY);
    this.cityService.state.set(UserState.NOT_LOADED_PLAYER);
  }
}
