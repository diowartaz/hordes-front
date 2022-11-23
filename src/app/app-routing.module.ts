import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LoginComponent } from './components/login/login.component';
import { LostPageComponent } from './components/lost-page/lost-page.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { XpComponent } from './components/xp/xp.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'xp',
    component: XpComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: LostPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
