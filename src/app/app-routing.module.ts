import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCityComponent } from './components/create-city/create-city.component';
import { HordesComponent } from './components/hordes/hordes.component';
import { LeaderboardHordesComponent } from './components/leaderboard-hordes/leaderboard-hordes.component';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { LoginComponent } from './components/login/login.component';
import { LostPageComponent } from './components/lost-page/lost-page.component';
import { ProfilComponent } from './components/profil/profil.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { CityNotNullGuard } from './shared/guards/city-not-null/city-not-null.guard';
import { GameLoadedGuard } from './shared/guards/game-loaded/game-loaded.guard';
import { NotauthGuard } from './shared/guards/notauth/notauth.guard';
import { StateGuard } from './shared/guards/state/state.guard';
import { DeathRecapComponent } from './components/hordes/recap/death-recap/death-recap.component';
import { AliveRecapComponent } from './components/hordes/recap/alive-recap/alive-recap.component';
import { DiggingsComponent } from './components/hordes/diggings/diggings.component';
import { SkillsComponent } from './components/hordes/skills/skills.component';
import { BuildingsComponent } from './components/hordes/buildings/buildings.component';

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
    canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
    children: [
      {
        path: '',
        redirectTo: 'dig',
        pathMatch: 'full',
      },
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
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard, GameLoadedGuard, CityNotNullGuard],
  },
  {
    path: 'leaderboard',
    component: LeaderboardHordesComponent,
    data: { ranked: false },
  },
  {
    path: 'ranked-leaderboard',
    component: LeaderboardHordesComponent,
    data: { ranked: true },
  },

  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'recap',
    component: AliveRecapComponent,
    canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
  },
  {
    path: 'death-recap',
    component: DeathRecapComponent,
    canActivate: [AuthGuard, GameLoadedGuard, StateGuard],
  },
  { path: '', redirectTo: 'play', pathMatch: 'full' },
  { path: '**', redirectTo: 'play' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
