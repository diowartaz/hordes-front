import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatsModel } from 'src/app/models/hordes';
import { RoutesEnum, UserState } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { XPToLVLandXP } from 'src/app/shared/utils/xp';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-header-logged-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.scss'],
})
export class HeaderLoggedInComponent implements OnInit {
  subscriptions: Subscription[] = [];
  xpString = '';
  lvl = '1';
  xpRatio = 50;
  goBackButton = false;
  userIsLoggedIn = false;
  money = 0;

  constructor(
    private cityService: CityService,
    private router: Router,
    private authService: AuthService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerStats$.subscribe((stats: StatsModel | null) => {
        if (stats != null) {
          const { lvl, xpString, ratio } = XPToLVLandXP(stats.xp);
          this.lvl = lvl;
          this.xpString = xpString;
          this.xpRatio = ratio;
          this.money = stats.money;
        }
      }),
      this.cityService.userPlayerState$.subscribe((userState: UserState) => {
        this.userIsLoggedIn = [UserState.PLAYING, UserState.NO_CITY].includes(userState);
      }),
    );
  }

  goToSettings() {
    this.router.navigate([RoutesEnum.SETTINGS]);
  }

  goToWiki() {
    this.router.navigate([RoutesEnum.WIKI]);
  }

  goToLeaderboard() {
    this.router.navigate([RoutesEnum.LEADERBOARD]);
  }

  goToProfil() {
    this.router.navigate([RoutesEnum.PROFIL], {
      queryParams: { user_id: this.authService.getUserId() },
    });
  }
  goToShop() {
    this.router.navigate([RoutesEnum.SHOP]);
  }

  goBack() {
    this.location.back();
  }
}
