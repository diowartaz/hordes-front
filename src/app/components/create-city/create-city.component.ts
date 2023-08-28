import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss'],
})
export class CreateCityComponent {
  createCityLoading: boolean = false;
  constructor(private router: Router, private cityService: CityService) { }

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
          console.log('error create city');
        } else {
          this.router.navigate(['play']);
        }
        this.createCityLoading = false;
      });
  }
}
