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
  public readonly cityService = inject(CityService);
  public readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  public readonly RoutesEnum = RoutesEnum;

  data = computed(() => {
    const { lvl, xpString, ratio } = XPToLVLandXP(this.cityService.stats().xp);
    return {
      lvl,
      xpString,
      xpRatio: ratio,
      money: this.cityService.stats().money,
    };
  });

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
