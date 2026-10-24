import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { ClassicPageComponent } from '../classic-page.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-settings',
  imports: [ClassicPageComponent, IconComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private cityService = inject(CityService);
  authService = inject(AuthService);

  goBackButton = false;

  deleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (confirmed) {
      this.authService.deleteAccount();
    }
  }
}
