import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, SignInParams, SignUpConflict, SignUpParams } from 'src/app/models/auth';
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

  token = signal<string | undefined>(readStorage(StorageKey.TOKEN) ?? undefined);
  email = signal<string | undefined>(readStorage(StorageKey.LOGIN) ?? undefined);

  tempAccount = computed(() => this.email()?.split('@')[1] === 'temp.com');

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
      .post<AuthResponse>(`${this.API_URL}signin`, params)
      .pipe(tap((result) => this.handleSuccessSignIn(result.token, result.email)));
  }

  signInTemp(): void {
    runRequest(this.signInTempLoading, this.httpClient.post<AuthResponse>(`${this.API_URL}signin-temp`, {}), (result) =>
      this.handleSuccessSignIn(result.token, result.email),
    );
  }

  private handleSuccessSignIn(token: string, email: string) {
    // Repart d'un état vierge au cas où un autre compte était chargé
    this.cityService.reset();
    writeStorage(StorageKey.TOKEN, token);
    writeStorage(StorageKey.LOGIN, email);
    this.email.set(email);
    this.token.set(token);
  }

  // Un conflit (409) n'est pas une erreur pour l'appelant : il reçoit les champs déjà utilisés
  signUp(params: SignUpParams): Observable<SignUpResult> {
    return this.httpClient.post<AuthResponse>(`${this.API_URL}signup`, params).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return of({ error: error.error.error as SignUpConflict });
        }
        return throwError(() => error);
      }),
    );
  }

  deleteAccount() {
    runRequest(this.deleteAccountLoading, this.httpClient.post(this.API_URL + 'delete', {}), () => this.logOut());
  }

  logOut() {
    removeStorage(StorageKey.TOKEN);
    this.token.set(undefined);
    this.cityService.reset();
  }
}
