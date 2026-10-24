import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthResponse } from 'src/app/models/auth';
import { readStorage, removeStorage, StorageKey, writeStorage } from 'src/app/shared/utils/storage';
import { environment } from 'src/environments/environment';
import { CityService } from '../city/city.service';
import { AuthService } from './auth.service';

const UPGRADE_URL = `${environment.API_URL}auth/guest/upgrade`;

const upgraded: AuthResponse = {
  token: 'new-token',
  account: { id: '1', username: 'player', email: 'player@example.com', role: 'user', isGuest: false },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    writeStorage(StorageKey.TOKEN, 'guest-token');
    writeStorage(StorageKey.LOGIN, 'abc@temp.invalid');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    removeStorage(StorageKey.TOKEN);
    removeStorage(StorageKey.LOGIN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('upgradeGuest', () => {
    it('remplace le token et l’email sans réinitialiser la partie', () => {
      const reset = spyOn(TestBed.inject(CityService), 'reset');
      expect(service.tempAccount()).toBeTrue();

      service.upgradeGuest({ email: 'player@example.com', password: 'password1' });
      const req = httpTesting.expectOne(UPGRADE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'player@example.com', password: 'password1' });
      req.flush(upgraded);

      expect(service.token()).toBe('new-token');
      expect(service.email()).toBe('player@example.com');
      expect(readStorage(StorageKey.TOKEN)).toBe('new-token');
      expect(readStorage(StorageKey.LOGIN)).toBe('player@example.com');
      expect(service.tempAccount()).toBeFalse();
      expect(service.upgradeGuestLoading()).toBeFalse();
      expect(reset).not.toHaveBeenCalled();
    });

    it('expose les champs déjà pris en cas de conflit', () => {
      service.upgradeGuest({ email: 'taken@example.com', username: 'taken', password: 'password1' });
      httpTesting
        .expectOne(UPGRADE_URL)
        .flush(
          { statusCode: 409, code: 'IDENTITY_TAKEN', details: ['username'] },
          { status: 409, statusText: 'Conflict' },
        );

      expect(service.upgradeGuestConflict()).toEqual({ emailAlreadyExists: false, usernameAlreadyExists: true });
      expect(service.token()).toBe('guest-token');
      expect(service.tempAccount()).toBeTrue();
    });

    it('ignore un second envoi pendant la requête', () => {
      service.upgradeGuest({ email: 'player@example.com', password: 'password1' });
      service.upgradeGuest({ email: 'player@example.com', password: 'password1' });

      expect(httpTesting.match(UPGRADE_URL).length).toBe(1);
    });
  });
});
