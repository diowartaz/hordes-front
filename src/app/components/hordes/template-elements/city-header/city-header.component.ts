import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { UserState } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';

@Component({
  selector: 'app-city-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-header.component.html',
  styleUrls: ['./city-header.component.scss'],
})
export class CityHeaderComponent implements OnInit {
  cityService = inject(CityService);
  subscriptions: Subscription[] = [];
  endDayLoading = false;
  time: any = { string: '8h00', seconds: 8 * 60 * 60 };
  headerIsDisplayed = computed(() => {
    return [UserState.PLAYING].includes(this.cityService.state());
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCityTime$.subscribe((time) => {
        this.time = time;
        if (
          (this.time.string == '00h00' || this.time.string == '23h59') &&
          this.cityService.state() === UserState.PLAYING
        ) {
          this.endDay();
        }
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
          /* empty */
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
