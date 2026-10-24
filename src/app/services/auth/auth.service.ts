import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, SignInParams, SignUpConflict, SignUpParams, UpgradeGuestParams } from 'src/app/models/auth';
import { decodeJwt, isJwtExpired } from 'src/app/shared/utils/jwt';
import { runRequest } from 'src/app/shared/utils/http';
import { readStorage, removeStorage, StorageKey, writeStorage } from 'src/app/shared/utils/storage';
import { CityService } from '../city/city.service';

export type SignUpResult = AuthResponse | { error: SignUpConflict };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private cityService = inject(CityService);

  private readonly API_URL = environment.API_URL;

  signInTempLoading = signal(false);
  deleteAccountLoading = signal(false);
  upgradeGuestLoading = signal(false);
  // Champs déjà pris lors de la dernière tentative de conversion du compte invité
  upgradeGuestConflict = signal<SignUpConflict | null>(null);

  token = signal<string | undefined>(readStorage(StorageKey.TOKEN) ?? undefined);
  email = signal<string | undefined>(readStorage(StorageKey.LOGIN) ?? undefined);

  // Les comptes invités ont un email réservé (@temp.invalid ; @temp.com pour les plus anciens)
  tempAccount = computed(() => ['temp.invalid', 'temp.com'].includes(this.email()?.split('@')[1] ?? ''));

  verifiedToken = computed(() => {
    const token = this.token();
    return token && !isJwtExpired(token) ? token : undefined;
  });

  isConnected = computed(() => this.verifiedToken() !== undefined);

  userId = computed(() => {
    const token = this.verifiedToken();
    return token ? decodeJwt(token)?.id : undefined;
  });

  signIn(params: SignInParams): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}auth/signin`, params)
      .pipe(tap((result) => this.handleSuccessSignIn(result.token, result.account.email)));
  }

  signInTemp(): void {
    runRequest(this.signInTempLoading, this.httpClient.post<AuthResponse>(`${this.API_URL}auth/guest`, {}), (result) =>
      this.handleSuccessSignIn(result.token, result.account.email),
    );
  }

  private handleSuccessSignIn(token: string, email: string) {
    // Repart d'un état vierge au cas où un autre compte était chargé
    this.cityService.reset();
    this.storeSession(token, email);
  }

  private storeSession(token: string, email: string) {
    writeStorage(StorageKey.TOKEN, token);
    writeStorage(StorageKey.LOGIN, email);
    this.email.set(email);
    this.token.set(token);
  }

  // Un conflit (409) n'est pas une erreur pour l'appelant : il reçoit les champs déjà utilisés
  signUp(params: SignUpParams): Observable<SignUpResult> {
    return this.httpClient.post<AuthResponse>(`${this.API_URL}auth/signup`, params).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return of({ error: this.toConflict(error) });
        }
        return throwError(() => error);
      }),
    );
  }

  // Le même joueur continue avec un nouveau token (l'ancien est révoqué) : la partie chargée est conservée
  upgradeGuest(params: UpgradeGuestParams): void {
    runRequest(
      this.upgradeGuestLoading,
      this.httpClient.post<AuthResponse>(`${this.API_URL}auth/guest/upgrade`, params),
      (result) => {
        this.upgradeGuestConflict.set(null);
        this.storeSession(result.token, result.account.email);
      },
      (error) => {
        if (error instanceof HttpErrorResponse && error.status === 409) {
          this.upgradeGuestConflict.set(this.toConflict(error));
        }
      },
    );
  }

  // { code: 'IDENTITY_TAKEN', details: ['email', 'username'] }
  private toConflict(error: HttpErrorResponse): SignUpConflict {
    const taken: string[] = error.error?.details ?? [];
    return {
      emailAlreadyExists: taken.includes('email'),
      usernameAlreadyExists: taken.includes('username'),
    };
  }

  deleteAccount() {
    runRequest(this.deleteAccountLoading, this.httpClient.delete(this.API_URL + 'me', { body: {} }), () =>
      this.logOut(),
    );
  }

  logOut() {
    removeStorage(StorageKey.TOKEN);
    this.token.set(undefined);
    this.cityService.reset();
  }
}
