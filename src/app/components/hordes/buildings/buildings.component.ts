import { Component } from '@angular/core';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import {
  updateCustomInventory,
  getCustomInventoryDefault,
} from 'src/app/shared/utils/inventory';
import { getTimeRequiredString } from 'src/app/shared/utils/time';
import { BuildingModel, CityModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {
  city: any = null;
  buildings: any = [];
  buildLoading: boolean = false;
  subscriptions: Subscription[] = [];
  dialogMessage: string = 'init';
  snackBarOpened: boolean = false;
  setTimeoutRefs: any = [];

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
      this.buildings.forEach((building: any) => {
        this.setCustomInventory(building);
        this.setEnoughRessources(building);
        this.setEnoughTime(building);
        this.setBuildingTimeString(building);
      });
    }
  }

  setCustomInventory(building: any) {
    building.customInventory = [
      ...updateCustomInventory(getCustomInventoryDefault(), building.inventory),
    ];
  }

  setEnoughRessources(building: any) {
    building.enoughRessources = this.contains(
      this.city.inventory,
      building.inventory
    );
  }

  setEnoughTime(building: any) {
    building.enoughTime =
      this.cityService.userPlayerCityTime$.getValue().seconds +
        building.time * this.city.speeds.build <=
      this.cityService.defaultValues$.getValue().day_end_time;
    if (building.enoughTime) {
      let timeoutSeconds =
        (this.cityService.defaultValues$.getValue().day_end_time -
          building.time * this.city.speeds.build -
          this.cityService.userPlayerCityTime$.getValue().seconds) /
        this.cityService.defaultValues$.getValue().coef_realtime_to_ingametime;
      this.setTimeoutRefs.push(
        setTimeout(() => {
          building.enoughTime = false;
        }, timeoutSeconds * 1000)
      );
    }
  }

  setBuildingTimeString(building: any) {
    building.buildingTimeString = getTimeRequiredString(
      building.time * this.city.speeds.build
    );
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
    if (this.city) {
      let isBuildable: boolean =
        building.enoughRessources &&
        building.enoughTime &&
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
    this.setTimeoutRefs.forEach((ref: any) => {
      clearTimeout(ref);
    });
  }
}
