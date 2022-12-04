import { Component } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-hordes',
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
})
export class HordesComponent {
  xpString: string = '';
  jour: number = 21;
  city: any = null;
  xp: number = 0;
  lvl: number = 1;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userGameCity$.subscribe((city: any) => (this.city = city));
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

  getHourString(seconds: number): any {
    let nbHeures = Math.floor(seconds / 3600);
    let nbMinutesInSeconds: number = (seconds - nbHeures * 3600) % 3600;
    let nbMinutes: number = Math.floor(nbMinutesInSeconds / 36);
    let nbMinutesString: string = nbMinutes + '';
    if (nbMinutes < 10) {
      nbMinutesString = '0' + nbMinutes;
    }
    return nbHeures + 'h' + nbMinutesString;
  }
}
