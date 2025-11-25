import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
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
export class AliveRecapComponent {
  public cityService = inject(CityService);

  nbMaxChoices = computed(() => {
    return this.cityService.city().attackRecap.architect_shelter_buildings.length - 2;
  });

  nbChoicesAvailable = computed(() => {
    return this.cityService.city().attackRecap.architect_shelter_buildings.length;
  });

  startDayLoading = false;
  library_discoveriesFormatted = computed(() => {
    const library_discoveriesFormatted = [];
    for (const discoverySkillId in this.cityService.city().attackRecap.library_discoveries) {
      for (const skill of this.cityService.city().skills) {
        if ((skill.id as unknown as string) === discoverySkillId) {
          //TODO peut etre faire mieux
          library_discoveriesFormatted.push({
            name: skill.name,
            lvl: skill.lvl,
            old_lvl_max: skill.lvl_max - this.cityService.city().attackRecap.library_discoveries[discoverySkillId],
            lvl_max: skill.lvl_max,
          });
          break;
        }
      }
    }
    return library_discoveriesFormatted;
  });
  Object = Object;

  constructor(private router: Router) {}

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
    const buildingSelected: (undefined | boolean)[] = this.cityService
      .city()
      .attackRecap.architect_shelter_buildings.map((b: any) => b.selected);
    const result = [];
    for (let i = 0; i < buildingSelected.length; i++) {
      if (buildingSelected[i]) result.push(i);
    }
    return result;
  }

  onCheckboxChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const buildings = this.cityService.city().attackRecap.architect_shelter_buildings;

    if (input.checked) {
      const selectedCount = buildings.filter((b: { selected: any }) => b.selected).length;
      if (selectedCount > this.nbMaxChoices()) {
        input.checked = false; // revert checkbox in DOM
        buildings[index].selected = false; // revert model
      }
    }
  }
}
