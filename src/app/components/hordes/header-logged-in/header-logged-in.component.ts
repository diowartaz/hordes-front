import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatsModel } from 'src/app/models/hordes';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { XPToLVLandXP } from 'src/app/shared/utils/xp';

@Component({
  selector: 'app-header-logged-in',
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.scss'],
})
export class HeaderLoggedInComponent {
  subscriptions: Subscription[] = [];
  xpString: string = '';
  lvl: number = 1;
  xpRatio: number = 50;

  constructor(
    private cityService: CityService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerStats$.subscribe((stats: StatsModel | null) => {
        if (stats != null) {
          let { lvl, xpString, ratio } = XPToLVLandXP(stats.xp);
          this.lvl = lvl;
          this.xpString = xpString;
          this.xpRatio = ratio;
        }
      }),
    );
  }

  goToSettings() {
    this.router.navigate(['settings']);
  }

  goToLeaderboard() {
    this.router.navigate(['leaderboard']);
  }

  goToProfil() {
    this.router.navigate(['profil'], {
      queryParams: { user_id: this.authService.getUserId() },
    });
  }
}
