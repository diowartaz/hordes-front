import { Component } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import {
  updateCustomInventory,
  getCustomInventoryDefault,
} from 'src/app/shared/utils/inventory';
import { getTimeString } from 'src/app/shared/utils/time';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {
  city: any = null;
  buildings: any = [];
  buildLoading: boolean = false;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: any) => {
      if (city) {
        this.city = city;
        this.initCustomCityBuildings();
      }
    });
  }

  initCustomCityBuildings() {
    this.buildings = [...this.city.buildings];
    for (let i = 0; i < this.buildings.length; i++) {
      this.buildings[i].customInventory = [
        ...updateCustomInventory(
          getCustomInventoryDefault(),
          this.buildings[i].inventory
        ),
      ];
    }
  }

  getTimeString(seconds: number) {
    return getTimeString(seconds);
  }

  build(building: any) {
    if (this.buildLoading) {
      return;
    }
    if (!this.isBuildable(building)) {
      console.log('not buildable');
      return;
    }
    this.buildLoading = true;
    this.cityService
      .build(building.id)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error');
        } else {
        }
        this.buildLoading = false;
      });
  }

  contains(inv1: any, inv2: any) {
    //return inv1 >= inv2
    for (const itemName in inv2) {
      if (
        !(inv1.hasOwnProperty(itemName) && inv1[itemName] >= inv2[itemName])
      ) {
        return false;
      }
    }
    return true;
  }

  isBuildable(building: any): boolean {
    //has ressource
    //has time
    //lvl < lvl_max
    let isBuildable: boolean =
      this.contains(this.city.inventory, building.inventory) &&
      this.city.time + building.time <=
        this.cityService.defaultValues$.getValue().day_end_time &&
      building.lvl < building.lvl_max;
    return isBuildable;
  }
}
