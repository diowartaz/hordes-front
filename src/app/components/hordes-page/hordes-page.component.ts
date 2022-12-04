import { Component } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-hordes-page',
  templateUrl: './hordes-page.component.html',
  styleUrls: ['./hordes-page.component.scss'],
})
export class HordesPageComponent {
  getGameCityLoading: boolean = false;
  getGameXPLoading: boolean = false;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.getGameCity();
    this.getGameXP();
  }

  getGameCity() {
    this.getGameCityLoading = true;
    this.cityService
      .getGameCity()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.getGameCityLoading = false;
      });
  }

  getGameXP() {
    this.getGameXPLoading = true;
    this.cityService
      .getGameXP()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.getGameXPLoading = false;
      });
  }
}
