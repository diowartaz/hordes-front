import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../../models/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userIsLoggedIn() ? true : router.createUrlTree([RoutesEnum.SIGNIN]);
};
