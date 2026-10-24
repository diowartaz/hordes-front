import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RoutesEnum } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-header-logged-in',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.scss'],
})
export class HeaderLoggedInComponent {
  public readonly cityService = inject(CityService);
  public readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  public readonly RoutesEnum = RoutesEnum;

  data = computed(() => ({
    money: this.cityService.stats().money.toLocaleString('fr-FR'),
  }));
}
