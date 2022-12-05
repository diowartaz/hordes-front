import { Component } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { getTimeString } from 'src/app/shared/utils/time';

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
  goToSleepLoading: boolean = false;
  content: string = 'buildings';

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userGameCity$.subscribe((city: any) => {
      this.city = city;
    });
    this.cityService.userGameXp$.subscribe((xp: any) => {
      let { lvl, xpString } = this.getLVLandXPString(xp);
      this.lvl = lvl;
      this.xpString = xpString;
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

  getTimeString(seconds: number): any {
    return getTimeString(seconds)
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
}
