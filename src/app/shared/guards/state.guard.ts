import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { routeForState, UserState } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

export const stateGuard: CanActivateFn = (route) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  const userState = cityService.state();
  const allowedStates = route.data['allowedStates'] as UserState[] | undefined;

  if (!allowedStates || allowedStates.includes(userState)) {
    return true;
  }
  return router.parseUrl(routeForState(userState));
};
