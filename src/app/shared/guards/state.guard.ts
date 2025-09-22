import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { statesToRoutes, UserSate } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

export const stateGuard: CanActivateFn = (route) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  const userState = cityService.userPlayerState$.getValue() as UserSate;
  const allowedStates = route.data['allowedStates'] as string[] | undefined;

  if (!allowedStates || allowedStates.includes(userState)) {
    return true; // ✅ allowed
  }

  const redirect = statesToRoutes[userState] ?? 'load-player';
  return router.parseUrl('/' + redirect);
};

// export const stateGuard: CanActivateFn = (_route, state) => {
//   const cityService = inject(CityService);
//   const router = inject(Router);

//   const userState = cityService.userPlayerState$.getValue();
//   console.log('reg', userState);

//   if (!userState || userState.length === 0) {
//     return router.parseUrl('/load-player');
//   }

//   return userState === getUserStateCorrespondingToTheUrlTheUserIsTryingToAccess(state.url)
//     ? true
//     : router.parseUrl(`/${statesToRoutes[userState]}`);
// };

// if (!cityService.playerLoaded$.getValue()) {
//   return router.createUrlTree([RoutesEnum.LOAD_PLAYER]);
// }
// let desiredStateFromUrl = '';
// for (const [key, value] of Object.entries(statesToRoutes)) {
//   if (value === state.url.slice(1).split('/')[0]) {
//     desiredStateFromUrl = key;
//   }
// }
// if (cityService.userPlayerState$.getValue() === desiredStateFromUrl) {
//   return true;
// } else {
//   return router.createUrlTree([desiredStateFromUrl]);
// }

// if (cityService.userPlayerState$.getValue().length == 0) {
//       router.navigate(['load-player']);
//       return false;
//     }
//     let userPlayerState: string = '';
//     for (const [key, value] of Object.entries(statesToRoutes)) {
//       if (value === state.url.slice(1).split('/')[0]) {
//         userPlayerState = key;
//       }
//     }
//     if (cityService.userPlayerState$.getValue() === userPlayerState) {
//       return true;
//     } else {
//       router.navigate([statesToRoutes[cityService.userPlayerState$.getValue()]]);
//       return false;
//     }
