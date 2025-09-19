import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';

@Component({
  selector: 'app-city-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-header.component.html',
  styleUrls: ['./city-header.component.scss'],
})
export class CityHeaderComponent {
  subscriptions: Subscription[] = [];
  endDayLoading: boolean = false;
  time: any = { string: '8h00', seconds: 8 * 60 * 60 };
  city: any = null;

  constructor(
    private cityService: CityService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCityTime$.subscribe((time) => {
        this.time = time;
        if (this.time.string == '00h00' || this.time.string == '23h59') {
          this.endDay();
        }
      }),
    );
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        this.city = city;
      }),
    );
  }

  endDay() {
    if (this.endDayLoading) {
      return;
    }
    this.endDayLoading = true;
    this.cityService
      .endDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        this.endDayLoading = false;
        if (result.error) {
        } else {
          this.router.navigate(['recap']); //or death recap handler by state guard
        }
      });
  }

  formatTimeToString(seconds: number | undefined): string {
    if (!seconds) {
      return '__h__';
    }
    return formatTimeToString(seconds, true);
  }
}
