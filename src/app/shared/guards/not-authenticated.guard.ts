import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../../models/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const notAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.userIsLoggedIn()) {
    return true;
  } else {
    const playRoute = localStorage.getItem('play-route') ?? '';
    return router.createUrlTree([RoutesEnum.PLAY, playRoute]);
  }
};
