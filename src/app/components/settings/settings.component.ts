import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  loading: boolean = true;
  constructor(
    private router: Router,
    private cityService: CityService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  goBackCityView() {
    this.router.navigate(['play/' + localStorage.getItem('play-route')]);
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
