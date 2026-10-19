import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ClassicPageComponent],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
