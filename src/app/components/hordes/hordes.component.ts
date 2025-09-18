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
  content: string = 'dig';
  subscriptions: Subscription[] = [];

  constructor(
    private cityService: CityService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {}



  changeContent(content: string) {
    this.content = content;
    localStorage.setItem('play-route', content);
    this.router.navigate(['play/' + content]);
  }

  getStyle(content: string) {
    if (content == this.content) {
      return { background: 'var(--background-black-opacity-zero-six)' };
    }
    return {};
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
