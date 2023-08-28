import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';
import { CityModel, StatsModel } from 'src/app/models/hordes';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { getLVLandXPString } from 'src/app/shared/utils/xp';

@Component({
  selector: 'app-hordes',
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
})
export class HordesComponent {
  xpString: string = '';
  jour: number = 1;
  city: any = null;
  xp: number = 0;
  lvl: number = 1;

  endDayLoading: boolean = false;
  content: string = 'buildings';
  time: any = { string: '8h00', seconds: 8 * 60 * 60 };
  dialogOpened: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private cityService: CityService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCityTime$.subscribe((time) => {
        this.time = time;
        if (this.time.string == '00h00' || this.time.string == '23h59') {
          this.endDay();
        }
      })
    );
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        this.city = city;
        // if (this.city && this.city.state == 'recap') {
        //   this.router.navigate(['recap']);
        // }
      })
    );
    this.subscriptions.push(
      this.cityService.userPlayerStats$.subscribe((stats: StatsModel | null) => {
        if (stats != null) {
          let { lvl, xpString } = getLVLandXPString(stats.xp);
          this.lvl = lvl;
          this.xpString = xpString;
        }
      })
    );
  }


  getTimeString(seconds: number | undefined): string {
    if (!seconds) {
      return '__h__';
    }
    return getTimeString(seconds);
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
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.endDayLoading = false;
        if (result.error) {
        } else {
          this.router.navigate(['recap']); //or death recap handler by state guard
        }
      });
  }

  changeContent(content: string) {
    this.content = content;
  }

  getStyle(content: string) {
    if (content == this.content) {
      return { background: 'var(--background-black-opacity-zero-six)' };
    }
    return {};
  }

  goToSettings() {
    this.router.navigate(['settings']);
  }

  goToLeaderboard() {
    this.router.navigate(['leaderboard']);
  }

  goToProfil() {
    this.router.navigate(['profil'], {
      queryParams: { user_id: this.authService.getUserId() },
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
