import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['logOut', 'isConnected']);
    authService.isConnected.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBar },
        { provide: AuthService, useValue: authService },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpTesting.verify());

  function failRequest(path: string, status: number, body: object = {}) {
    let failed = false;
    http.get(environment.API_URL + path).subscribe({ error: () => (failed = true) });
    httpTesting.expectOne(environment.API_URL + path).flush(body, { status, statusText: 'KO' });
    expect(failed).withContext("l'erreur doit être propagée à l'appelant").toBeTrue();
  }

  it('déconnecte le joueur quand le token est refusé', () => {
    failRequest('me', 401);
    expect(authService.logOut).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('laisse le formulaire de connexion gérer un mauvais mot de passe', () => {
    failRequest('auth/signin', 401);
    expect(authService.logOut).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });

  it('affiche le message renvoyé par le back', () => {
    failRequest('me/city/buildings/3/upgrade', 422, {
      statusCode: 422,
      code: 'BUILDING_NOT_AVAILABLE',
      message: 'Building 3 not available',
    });
    expect(snackBar.open).toHaveBeenCalledWith('Building 3 not available', 'OK', jasmine.any(Object));
    expect(authService.logOut).not.toHaveBeenCalled();
  });
});
