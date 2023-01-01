import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCityComponent } from './components/create-city/create-city.component';
import { HomeComponent } from './components/home/home.component';
import { HordesComponent } from './components/hordes/hordes.component';
import { RecapDialogComponent } from './components/hordes/recap-dialog/recap-dialog.component';
import { LeaderboardHordesComponent } from './components/leaderboard-hordes/leaderboard-hordes.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { LoginComponent } from './components/login/login.component';
import { LostPageComponent } from './components/lost-page/lost-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TestComponent } from './components/test/test.component';
import { XpComponent } from './components/xp/xp.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { CityNotNullGuard } from './shared/guards/city-not-null/city-not-null.guard';
import { GameLoadedGuard } from './shared/guards/game-loaded/game-loaded.guard';
import { NotauthGuard } from './shared/guards/notauth/notauth.guard';

const routes: Routes = [
  {
    path: 'signin',
    component: LoginComponent,
    canActivate: [NotauthGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [NotauthGuard],
  },
  {
    path: 'load-player',
    component: LoadPlayerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-city',
    component: CreateCityComponent,
    canActivate: [AuthGuard, GameLoadedGuard],
  },
  {
    path: 'play',
    component: HordesComponent,
    canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
  },
  {
    path: 'leaderboard',
    component: LeaderboardHordesComponent,
  },
  {
    path: 'recap',
    component: RecapDialogComponent,
    canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
  },
  {
    path: '',
    component: HordesComponent,
    canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
  },
  {
    path: '**',
    component: LostPageComponent,
  },
];

// {
//   path: 'home',
//   component: HomeComponent,
//   canActivate: [AuthGuard],
// },
// {
//   path: 'xp',
//   component: XpComponent,
//   canActivate: [AuthGuard],
// },
// {
//   path: 'leaderboard',
//   component: LeaderboardComponent,
//   canActivate: [AuthGuard],
// },
// {
//   path: 'test',
//   component: TestComponent,
//   canActivate: [AuthGuard],
// },

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
