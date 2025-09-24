import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { RoutesEnum } from 'src/app/models/router';
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
  loading = true;
  goBackButton = false;
  constructor(
    private router: Router,
    private cityService: CityService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.goBackButton = this.route.snapshot.data['goBackButton'] ?? false;
    console.log(this.goBackButton);
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  goBackCityView() {
    this.router.navigate([RoutesEnum.PLAY, localStorage.getItem('play-route')]);
  }

  deleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (confirmed) {
      this.loading = true;
      this.authService
        .deleteAccount()
        .pipe(
          take(1),
          catchError(() => of({ error: 'error' })),
        )
        .subscribe((result: any) => {
          if (result.error) {
            console.log('error delete game');
          } else {
            this.loading = false;
            this.logOut();
          }
        });
    }
  }

  logCity() {
    console.log('city', this.cityService.userPlayerCity$.getValue());
  }
}
