import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-alive-recap',
  templateUrl: './alive-recap.component.html',
  styleUrls: ['./alive-recap.component.scss']
})
export class AliveRecapComponent {
  city: any = null;
  startDayLoading: boolean = false;
  library_discoveriesFormatted: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private cityService: CityService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        if (city) {
          this.city = city;
          if (
            this.city &&
            this.city.attackRecap &&
            this.city.attackRecap.library_discoveries
          ) {
            this.init_library_discoveriesFormatted();
          }
        }
      })
    );
  }

  init_library_discoveriesFormatted() {
    for (const discoverySkillId in this.city.attackRecap.library_discoveries) {
      for (let i = 0; i < this.city.skills.length; i++) {
        if (this.city.skills[i].id == discoverySkillId) {
          this.library_discoveriesFormatted.push({
            name: this.city.skills[i].name,
            lvl: this.city.skills[i].lvl,
            old_lvl_max:
              this.city.skills[i].lvl_max -
              this.city.attackRecap.library_discoveries[discoverySkillId],
            lvl_max: this.city.skills[i].lvl_max,
          });
          break;
        }
      }
    }
  }

  startDay() {
    if (this.startDayLoading) {
      return;
    }
    this.startDayLoading = true;
    this.cityService
      .startDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.startDayLoading = false;
        if (result.error) {
        } else {
          this.router.navigate(['play/'+ localStorage.getItem('play-route')]);
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
