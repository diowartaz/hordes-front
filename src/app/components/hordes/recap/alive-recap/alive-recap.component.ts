import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { RecapHeaderComponent } from '../recap-header/recap-header.component';
import { BuildingRecapComponent } from './building-recap/building-recap.component';
import { SkillRecapComponent } from './skill-recap/skill-recap.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alive-recap',
  standalone: true,
  imports: [RecapHeaderComponent, BuildingRecapComponent, SkillRecapComponent, CommonModule, FormsModule],
  templateUrl: './alive-recap.component.html',
  styleUrls: ['./alive-recap.component.scss'],
})
export class AliveRecapComponent implements OnInit, OnDestroy {
  city: any = null;
  startDayLoading = false;
  library_discoveriesFormatted: any[] = [];
  subscriptions: Subscription[] = [];

  nbMaxChoices = 0;
  nbChoicesAvailable = 0;

  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        if (city) {
          this.city = city;
          this.nbMaxChoices = city.attackRecap.architect_shelter_buildings.length - 2;
          this.nbChoicesAvailable = city.attackRecap.architect_shelter_buildings.length;
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
            old_lvl_max: skill.lvl_max - this.city.attackRecap.library_discoveries[discoverySkillId],
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
      .startDay(this.whatAreTheSelectedBuildings())
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

  whatAreTheSelectedBuildings() {
    const buildingSelected: (undefined | boolean)[] = this.city.attackRecap.architect_shelter_buildings.map(
      (b: any) => b.selected,
    );
    const result = [];
    for (let i = 0; i < buildingSelected.length; i++) {
      if (buildingSelected[i]) result.push(i);
    }
    return result;
  }

  onCheckboxChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const buildings = this.city.attackRecap.architect_shelter_buildings;

    if (input.checked) {
      const selectedCount = buildings.filter((b: { selected: any }) => b.selected).length;
      if (selectedCount > this.nbMaxChoices) {
        input.checked = false; // revert checkbox in DOM
        buildings[index].selected = false; // revert model
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
