import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';
import { CityModel, DataModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-hordes',
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
})
export class HordesComponent {
  xpString: string = '';
  jour: number = 1;
  city: CityModel | null = null;
  xp: number = 0;
  lvl: number = 1;
  goToSleepLoading: boolean = false;
  content: string = 'buildings';

  constructor(private cityService: CityService, private router: Router) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
      this.city = city;
    });
    this.cityService.userPlayerData$.subscribe((data: DataModel | null) => {
      if (data != null) {
        let { lvl, xpString } = this.getLVLandXPString(data.xp);
        this.lvl = lvl;
        this.xpString = xpString;
      }
    });
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

  goToSleep() {
    if (this.goToSleepLoading) {
      return;
    }
    this.goToSleepLoading = true;
    this.cityService
      .goToSleep()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.goToSleepLoading = false;
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
}
