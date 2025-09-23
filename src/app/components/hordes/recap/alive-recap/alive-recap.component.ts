import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { RecapHeaderComponent } from '../recap-header/recap-header.component';
import { BuildingRecapComponent } from './building-recap/building-recap.component';
import { SkillRecapComponent } from './skill-recap/skill-recap.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alive-recap',
  standalone: true,
  imports: [RecapHeaderComponent, BuildingRecapComponent, SkillRecapComponent, CommonModule],
  templateUrl: './alive-recap.component.html',
  styleUrls: ['./alive-recap.component.scss'],
})
export class AliveRecapComponent implements OnInit, OnDestroy {
  city: any = null;
  startDayLoading = false;
  library_discoveriesFormatted: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        if (city) {
          this.city = city;
          if (this.city && this.city.attackRecap && this.city.attackRecap.library_discoveries) {
            this.init_library_discoveriesFormatted();
          }
        }
      }),
    );
  }

  init_library_discoveriesFormatted() {
    for (const discoverySkillId in this.city.attackRecap.library_discoveries) {
      for (const skill of this.city.skills) {
        if (skill.id == discoverySkillId) {
          this.library_discoveriesFormatted.push({
            name: skill.name,
            lvl: skill.lvl,
            old_lvl_max:
              skill.lvl_max - this.city.attackRecap.library_discoveries[discoverySkillId],
            lvl_max: skill.lvl_max,
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
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        this.startDayLoading = false;
        if (result.error) {
          /* empty */
        } else {
          this.router.navigate(['play/' + localStorage.getItem('play-route')]);
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
