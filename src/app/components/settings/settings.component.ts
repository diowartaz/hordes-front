import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  quitGameLoading: boolean = true;
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {}

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  goBackGame() {
    this.router.navigate(['game']);
  }

  quitGame() {
    this.quitGameLoading = true;
    this.cityService
      .delete()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error delete game');
        } else {
          this.router.navigate(['create-city']);
          this.quitGameLoading = false;
        }
      });
  }
}
