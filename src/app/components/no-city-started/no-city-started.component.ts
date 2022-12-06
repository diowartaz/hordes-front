import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-no-city-started',
  templateUrl: './no-city-started.component.html',
  styleUrls: ['./no-city-started.component.scss'],
})
export class NoCityStartedComponent {
  createCityLoading: boolean = false;
  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    if (this.cityService.userGameCity$.getValue()) {
      this.router.navigate(['game']);
    }
  }

  createCity() {
    if (this.createCityLoading) {
      return;
    }
    this.createCityLoading = true;
    this.cityService
      .new()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error load game');
        } else {
          this.router.navigate(['game']);
        }
        this.createCityLoading = false;
      });
  }
}
