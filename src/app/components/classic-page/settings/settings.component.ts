import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  goBackButton = false;
  constructor(
    private cityService: CityService,
    public authService: AuthService,
  ) {}

  deleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (confirmed) {
      this.authService.deleteAccount();
    }
  }
}
