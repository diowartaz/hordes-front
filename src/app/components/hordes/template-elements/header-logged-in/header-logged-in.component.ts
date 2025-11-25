import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from 'src/app/models/router';
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
export class HeaderLoggedInComponent {
  cityService = inject(CityService);
  goBackButton = false;

  data = computed(() => {
    const { lvl, xpString, ratio } = XPToLVLandXP(this.cityService.stats().xp);
    return {
      lvl,
      xpString,
      xpRatio: ratio,
      money: this.cityService.stats().money,
    };
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
  ) {}

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
