import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../../models/router';
import { CityService } from 'src/app/services/city/city.service';

export const gameLoadedGuard: CanActivateFn = (_route, state) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  if (!cityService.playerLoaded$.getValue()) {
    if (state.url.split('/')[1] === RoutesEnum.PLAY) {
      localStorage.setItem('play-route', state.url.split('/')[2]);
    }
    return router.createUrlTree([RoutesEnum.LOAD_PLAYER]);
  }
  return true;
};
