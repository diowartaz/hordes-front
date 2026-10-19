import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLAY_ROUTES, PlayRoute, RoutesEnum, UserState } from '../../models/router';
import { CityService } from 'src/app/services/city/city.service';
import { StorageKey, writeStorage } from '../utils/storage';

export const gameLoadedGuard: CanActivateFn = (_route, state) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  if (cityService.state() === UserState.NOT_LOADED_PLAYER) {
    // Mémorise l'onglet demandé pour y revenir une fois le joueur chargé
    const [, segment, playRoute] = state.url.split(/[?#]/)[0].split('/');
    if (segment === RoutesEnum.PLAY && PLAY_ROUTES.includes(playRoute as PlayRoute)) {
      writeStorage(StorageKey.PLAY_ROUTE, playRoute);
    }
    return router.createUrlTree([RoutesEnum.LOAD_PLAYER]);
  }
  return true;
};
