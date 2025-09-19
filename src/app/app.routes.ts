import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HordesComponent } from './components/hordes/hordes.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { RoutesEnum } from './models/routes';
import { notAuthenticatedGuard } from './shared/guards/not-authenticated.guard';
import { authGuard } from './shared/guards/auth.guard';
import { gameLoadedGuard } from './shared/guards/game-loaded.guard';

export const routes: Routes = [
  {
    path: RoutesEnum.SIGNIN,
    component: LoginComponent,
    canActivate: [notAuthenticatedGuard],
  },
  {
    path: RoutesEnum.SIGNUP,
    component: SignUpComponent,
    canActivate: [notAuthenticatedGuard],
  },
  {
    path: RoutesEnum.LOAD_PLAYER,
    component: LoadPlayerComponent,
    canActivate: [authGuard],
  },

  {
    path: RoutesEnum.PLAY,
    component: HordesComponent,
    canActivate: [authGuard, gameLoadedGuard], //, gameLoadedGuard, stateGuard
  },
  { path: '', redirectTo: RoutesEnum.PLAY, pathMatch: 'full' },
  { path: '**', redirectTo: RoutesEnum.PLAY },
];
