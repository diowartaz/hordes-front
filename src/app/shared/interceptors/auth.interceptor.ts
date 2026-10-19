import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (!req.url.startsWith(environment.API_URL) || !token) {
    return next(req);
  }

  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(cloned).pipe(
    catchError((error: unknown) => {
      // Token expiré ou révoqué côté back (changement de mot de passe, déconnexion de tous les appareils,
      // suppression du compte) : on déconnecte, sauf si un nouveau token a été obtenu entre-temps
      if (error instanceof HttpErrorResponse && error.status === 401 && authService.token() === token) {
        authService.logOut();
      }
      return throwError(() => error);
    }),
  );
};
