import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-create-city',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss'],
})
export class CreateCityComponent {
  createCityLoading = false;
  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  createCity(ranked: boolean) {
    if (this.createCityLoading) {
      return;
    }
    this.createCityLoading = true;
    this.cityService
      .new(ranked)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error create city');
        } else {
          localStorage.setItem('play-route', 'dig');
          this.router.navigate(['play']);
        }
        this.createCityLoading = false;
      });
  }
}
