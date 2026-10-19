import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { routeForState } from '../../models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';

export const notAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const cityService = inject(CityService);
  const router = inject(Router);

  return authService.isConnected() ? router.parseUrl(routeForState(cityService.state())) : true;
};
