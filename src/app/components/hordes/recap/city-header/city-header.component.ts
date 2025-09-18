import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { StatsModel } from 'src/app/models/hordes';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';
import { getLVLandXPString } from 'src/app/shared/utils/xp';

@Component({
  selector: 'app-city-header',
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

    getTimeString(seconds: number | undefined): string {
      if (!seconds) {
        return '__h__';
      }
      return getTimeString(seconds);
    }
}
