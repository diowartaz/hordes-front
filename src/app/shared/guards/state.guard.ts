import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { statesToRoutes, UserState } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

export const stateGuard: CanActivateFn = (route) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  const userState = cityService.state() as UserState;
  const allowedStates = route.data['allowedStates'] as string[] | undefined;

  if (!allowedStates || allowedStates.includes(userState)) {
    return true; // ✅ allowed
  }

  const redirect = statesToRoutes[userState];
  return router.parseUrl('/' + redirect);
};
