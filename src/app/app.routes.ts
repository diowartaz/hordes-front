import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HordesComponent } from './components/hordes/hordes.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { RoutesEnum, UserSate } from './models/router';
import { notAuthenticatedGuard } from './shared/guards/not-authenticated.guard';
import { authGuard } from './shared/guards/auth.guard';
import { gameLoadedGuard } from './shared/guards/game-loaded.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { stateGuard } from './shared/guards/state.guard';
import { CreateCityComponent } from './components/create-city/create-city.component';

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
    path: RoutesEnum.CREATE_CITY,
    component: CreateCityComponent,
    canActivate: [authGuard, gameLoadedGuard],
    data: { allowedStates: [UserSate.NO_CITY] },
  },
  {
    path: RoutesEnum.PLAY,
    component: HordesComponent,
    canActivate: [stateGuard], //authGuard, gameLoadedGuard, stateGuard
    //data: { allowedStates: [UserSate.PLAYING] },
    children: [
      {
        path: RoutesEnum.SETTINGS,
        component: SettingsComponent,
      },
    ],
  },
  { path: '', redirectTo: RoutesEnum.PLAY, pathMatch: 'full' },
  { path: '**', redirectTo: RoutesEnum.PLAY },
];
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { CreateCityComponent } from './components/create-city/create-city.component';
// import { HordesComponent } from './components/hordes/hordes.component';
// import { LeaderboardHordesComponent } from './components/leaderboard-hordes/leaderboard-hordes.component';
// import { LoadPlayerComponent } from './components/load-player/load-player.component';
// import { LoginComponent } from './components/login/login.component';
// import { LostPageComponent } from './components/lost-page/lost-page.component';
// import { ProfilComponent } from './components/profil/profil.component';
// import { SettingsComponent } from './components/settings/settings.component';
// import { SignUpComponent } from './components/sign-up/sign-up.component';
// import { AuthGuard } from './shared/guards/auth/auth.guard';
// import { CityNotNullGuard } from './shared/guards/city-not-null/city-not-null.guard';
// import { GameLoadedGuard } from './shared/guards/game-loaded/game-loaded.guard';
// import { NotauthGuard } from './shared/guards/notauth/notauth.guard';
// import { StateGuard } from './shared/guards/state/state.guard';
// import { DeathRecapComponent } from './components/hordes/recap/death-recap/death-recap.component';
// import { AliveRecapComponent } from './components/hordes/recap/alive-recap/alive-recap.component';
// import { DiggingsComponent } from './components/hordes/diggings/diggings.component';
// import { SkillsComponent } from './components/hordes/skills/skills.component';
// import { BuildingsComponent } from './components/hordes/buildings/buildings.component';

// const routes: Routes = [
//   {
//     path: 'signin',
//     component: LoginComponent,
//     canActivate: [NotauthGuard],
//   },
//   {
//     path: 'signup',
//     component: SignUpComponent,
//     canActivate: [NotauthGuard],
//   },
//   {
//     path: 'load-player',
//     component: LoadPlayerComponent,
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'create-city',
//     component: CreateCityComponent,
//     canActivate: [AuthGuard, GameLoadedGuard],
//   },
//   {
//     path: 'play',
//     component: HordesComponent,
//     canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
//     children: [
//       {
//         path: '',
//         redirectTo: 'dig',
//         pathMatch: 'full',
//       },
//       {
//         path: 'dig',
//         component: DiggingsComponent,
//       },
//       {
//         path: 'learn',
//         component: SkillsComponent,
//       },
//       {
//         path: 'build',
//         component: BuildingsComponent,
//       },
//     ],
//   },
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
