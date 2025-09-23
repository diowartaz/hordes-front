import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StatsModel } from 'src/app/models/hordes';
import { RoutesEnum } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { XPToLVLandXP } from 'src/app/shared/utils/xp';
import {  CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-header-logged-in',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.scss'],
})
export class HeaderLoggedInComponent implements OnInit {
  subscriptions: Subscription[] = [];
  xpString = '';
  lvl = '1';
  xpRatio = 50;
  goBackButton = false;

  constructor(
    private cityService: CityService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.goBackButton = this.route.snapshot.data['goBackButton'] ?? false;
    console.log("HeaderLoggedInComponent", this.goBackButton, this.route)
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerStats$.subscribe((stats: StatsModel | null) => {
        if (stats != null) {
          const { lvl, xpString, ratio } = XPToLVLandXP(stats.xp);
          this.lvl = lvl;
          this.xpString = xpString;
          this.xpRatio = ratio;
        }
      }),
    );
  }

  goToSettings() {
    this.router.navigate([RoutesEnum.SETTINGS]);
  }

  goToLeaderboard() {
    this.router.navigate([RoutesEnum.LEADERBOARD]);
  }

  goToProfil() {
    this.router.navigate([RoutesEnum.PROFIL], {
      queryParams: { user_id: this.authService.getUserId() },
    });
  }

  goBack() {
    this.location.back();
  }
}
