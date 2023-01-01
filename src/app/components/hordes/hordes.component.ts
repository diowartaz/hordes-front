import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';
import { CityModel, DataModel } from 'src/app/models/hordes';
import { MatDialog } from '@angular/material/dialog';
import { RecapDialogComponent } from './recap-dialog/recap-dialog.component';

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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCityTime$.subscribe((time) => {
        this.time = time;
        // if (
        //   this.time.seconds ==
        //   this.cityService.defaultValues$.getValue().day_end_time
        // ) {
        //   // fin de journee
        //   this.endDay();
        // }
      })
    );
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        this.city = city;
        if (this.city && this.city.state == 'recap') {
          this.router.navigate(['recap']);
          // this.dialogOpened = true;
          // this.openDialogRecap();
        }
      })
    );
    this.subscriptions.push(
      this.cityService.userPlayerData$.subscribe((data: DataModel | null) => {
        if (data != null) {
          let { lvl, xpString } = this.getLVLandXPString(data.xp);
          this.lvl = lvl;
          this.xpString = xpString;
        }
      })
    );
  }

  getLVLandXPString(xp: number): any {
    let reste = xp % 100;
    let quotient = Math.floor(xp / 100);
    return {
      lvl: quotient + 1,
      xpString: reste + '/100 xp',
    };
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
          this.router.navigate(['recap']);
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
