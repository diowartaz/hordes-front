import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class CreateCityComponent {
  createCityLoading = {
    normal: false,
    ranked: false,
  };
  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  createCity(ranked: boolean) {
    if (this.createCityLoading.normal || this.createCityLoading.ranked) {
      return;
    }
    this.createCityLoading[ranked ? 'ranked' : 'normal'] = true;
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
          localStorage.setItem('nb-dig', "1");
          localStorage.setItem('play-route', 'dig');
          this.router.navigate(['play']);
        }
        this.createCityLoading[ranked ? 'ranked' : 'normal'] = false;
      });
  }
}
