import { Component } from '@angular/core';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import {
  updateCustomInventory,
  getCustomInventoryDefault,
} from 'src/app/shared/utils/inventory';
import {
  getTimeRequiredString,
  getTimeString,
} from 'src/app/shared/utils/time';
import { BuildingModel, CityModel, DataModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {
  city: any = null;
  buildings: any = [];
  buildLoading: boolean = false;
  nbAppels: number = 0;
  subscriptions: Subscription[] = [];
  dialogMessage: string = 'init';
  snackBarOpened: boolean = false;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
        if (city) {
          this.city = city;
          this.initCustomCityBuildings();
        }
      })
    );
  }

  closeSnackBar() {
    this.snackBarOpened = false;
  }

  openSnackBar(message: string) {
    this.dialogMessage = message;
    this.snackBarOpened = true;
  }

  initCustomCityBuildings() {
    if (this.city) {
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
  }

  getTimeBuildingString(building: BuildingModel): string {
    if (!this.city) {
      return '__h__';
    }
    return getTimeRequiredString(building.time * this.city.speeds.build);
  }

  build(building: BuildingModel) {
    if (this.buildLoading) {
      return;
    }
    // let reason =
    if (!this.isBuildable(building)) {
      if (
        this.cityService.userPlayerCityTime$.getValue().seconds +
          building.time * this.city.speeds.build >
        this.cityService.defaultValues$.getValue().day_end_time
      ) {
        this.openSnackBar('Not enough time');
      } else if (building.lvl == building.lvl_max) {
        this.openSnackBar('Already at max level');
      } else {
        this.openSnackBar('Not enough items');
      }

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

  isBuildable(building: BuildingModel): boolean {
    this.nbAppels++;
    // console.log(this.nbAppels);
    //has ressource
    //has time
    //lvl < lvl_max
    if (this.city) {
      let isBuildable: boolean =
        this.contains(this.city.inventory, building.inventory) &&
        this.cityService.userPlayerCityTime$.getValue().seconds +
          building.time * this.city.speeds.build <=
          this.cityService.defaultValues$.getValue().day_end_time &&
        building.lvl < building.lvl_max;
      return isBuildable;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
