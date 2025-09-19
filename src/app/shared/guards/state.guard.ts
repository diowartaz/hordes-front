import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../../models/routes';
import { CityService } from 'src/app/services/city/city.service';

const statesToRoutes: Record<string, string> = {
  noCity: 'create-city',
  playing: 'play',
  deathRecap: 'death-recap',
  recap: 'recap',
  '': 'play',
};

export const stateGuard: CanActivateFn = (_route, state) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  if (!cityService.playerLoaded$.getValue()) {
    return router.createUrlTree([RoutesEnum.LOAD_PLAYER]);
  }
  let desiredStateFromUrl = '';
  for (const [key, value] of Object.entries(statesToRoutes)) {
    if (value === state.url.slice(1).split('/')[0]) {
      desiredStateFromUrl = key;
    }
  }
  if (cityService.userPlayerState$.getValue() === desiredStateFromUrl) {
    return true;
  } else {
    return router.createUrlTree([desiredStateFromUrl]);
  }
};

// if (this.cityService.userPlayerState$.getValue().length == 0) {
//       this.router.navigate(['load-player']);
//       return false;
//     }
//     let userPlayerState: string = '';
//     for (const [key, value] of Object.entries(this.statesToRoutes)) {
//       if (value === state.url.slice(1).split('/')[0]) {
//         userPlayerState = key;
//       }
//     }
//     if (this.cityService.userPlayerState$.getValue() === userPlayerState) {
//       return true;
//     } else {
//       this.router.navigate([this.statesToRoutes[this.cityService.userPlayerState$.getValue()]]);
//       return false;
//     }
