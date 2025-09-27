import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HordesComponent } from './components/hordes/hordes.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { RoutesEnum, UserState } from './models/router';
import { notAuthenticatedGuard } from './shared/guards/not-authenticated.guard';
import { authGuard } from './shared/guards/auth.guard';
import { gameLoadedGuard } from './shared/guards/game-loaded.guard';
import { SettingsComponent } from './components/classic-page/settings/settings.component';
import { stateGuard } from './shared/guards/state.guard';
import { CreateCityComponent } from './components/create-city/create-city.component';
import { DiggingsComponent } from './components/hordes/actions/diggings/diggings.component';
import { SkillsComponent } from './components/hordes/actions/skills/skills.component';
import { BuildingsComponent } from './components/hordes/actions/buildings/buildings.component';
import { AliveRecapComponent } from './components/hordes/recap/alive-recap/alive-recap.component';
import { DeathRecapComponent } from './components/hordes/recap/death-recap/death-recap.component';
import { ProfilComponent } from './components/classic-page/profil/profil.component';
import { LeaderboardHordesComponent } from './components/classic-page/leaderboard-hordes/leaderboard-hordes.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: RoutesEnum.HOME,
    component: HomeComponent,
    canActivate: [notAuthenticatedGuard],
  },
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
    path: RoutesEnum.CREATE_CITY,
    component: CreateCityComponent,
    canActivate: [authGuard, gameLoadedGuard],
    data: { allowedStates: [UserState.NO_CITY] },
  },
  {
    path: RoutesEnum.RECAP,
    component: AliveRecapComponent,
    canActivate: [authGuard, gameLoadedGuard, stateGuard],
    data: { allowedStates: [UserState.RECAP] },
  },
  {
    path: RoutesEnum.DEATH_RECAP,
    component: DeathRecapComponent,
    canActivate: [authGuard, gameLoadedGuard, stateGuard],
    data: { allowedStates: [UserState.DEAH_RECAP] },
  },
  {
    path: RoutesEnum.SETTINGS,
    component: SettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: RoutesEnum.LEADERBOARD,
    component: LeaderboardHordesComponent,
  },
  {
    path: RoutesEnum.PROFIL,
    component: ProfilComponent,
  },
  {
    path: RoutesEnum.PLAY,
    component: HordesComponent,
    canActivate: [authGuard, gameLoadedGuard, stateGuard], //authGuard, gameLoadedGuard, stateGuard
    data: { allowedStates: [UserState.PLAYING] },
    children: [
      {
        path: 'dig',
        component: DiggingsComponent,
      },
      {
        path: 'learn',
        component: SkillsComponent,
      },
      {
        path: 'build',
        component: BuildingsComponent,
      },

      {
        path: '',
        redirectTo: 'dig',
        pathMatch: 'full',
      },
    ],
  },
  { path: '', redirectTo: RoutesEnum.PLAY, pathMatch: 'full' },
  { path: '**', redirectTo: RoutesEnum.PLAY },
];

//   {
//     path: 'settings',
//     component: SettingsComponent,
//     canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
//   },
//   {
//     path: 'leaderboard',
//     component: LeaderboardHordesComponent,
//   },
//   {
//     path: 'profil',
//     component: ProfilComponent,
//   },
//   {
//     path: 'recap',
//     component: AliveRecapComponent,
//     canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
//   },
//   {
//     path: 'death-recap',
//     component: DeathRecapComponent,
//     canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
//   },
//   { path: '', redirectTo: 'play', pathMatch: 'full' },
//   { path: '**', redirectTo: 'play' },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
