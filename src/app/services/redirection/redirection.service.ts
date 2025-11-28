import { effect, Injectable } from '@angular/core';
import { RoutesEnum, statesToRoutes, UserState } from 'src/app/models/router';
import { CityService } from '../city/city.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

const PUBLIC_ROUTES = [
  RoutesEnum.PROFIL,
  RoutesEnum.WIKI,
  RoutesEnum.LEADERBOARD,
  RoutesEnum.HOME,
  RoutesEnum.SIGNIN,
  RoutesEnum.SIGNUP,
];

const STATE_LESS_ROUTES = [
  RoutesEnum.PROFIL,
  RoutesEnum.WIKI,
  RoutesEnum.LEADERBOARD,
  RoutesEnum.SHOP,
  RoutesEnum.SETTINGS,
];

@Injectable({
  providedIn: 'root',
})
export class RedirectionService {
  constructor(
    private cityService: CityService,
    private authService: AuthService,
    private router: Router,
  ) {
    effect(() => {
      if (this.authService.isConnected() && this.cityService.state() === UserState.NOT_LOADED_PLAYER) {
        this.cityService.loadPlayer();
      }
    });

    effect(() => {
      if (this.authService.isConnected()) {
        if (!STATE_LESS_ROUTES.includes(window.location.pathname.slice(1) as RoutesEnum)) {
          let urlRedirection = '/' + statesToRoutes[this.cityService.state()];
          if (urlRedirection === '/play') urlRedirection += '/' + localStorage.getItem('play-route');
          this.router.navigate([urlRedirection]);
        }
      }
    });

    effect(() => {
      if (!this.authService.isConnected()) {
        if (!PUBLIC_ROUTES.includes(window.location.pathname.slice(1) as RoutesEnum)) {
          this.router.navigate([RoutesEnum.HOME]);
        }
      }
    });
  }
}
