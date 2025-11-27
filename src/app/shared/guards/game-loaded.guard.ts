import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum, UserState } from '../../models/router';
import { CityService } from 'src/app/services/city/city.service';

export const gameLoadedGuard: CanActivateFn = (_route, state) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  if (cityService.state() === UserState.NOT_LOADED_PLAYER) {
    if (state.url.split('/')[1] === RoutesEnum.PLAY) {
      localStorage.setItem('play-route', state.url.split('/')[2]);
    }
    return router.createUrlTree([RoutesEnum.LOAD_PLAYER]);
  }
  return true;
};
