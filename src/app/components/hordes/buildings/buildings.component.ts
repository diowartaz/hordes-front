import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, of, Subscription, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { BuildingModel, CityModel } from 'src/app/models/hordes';
import { CommonModule } from '@angular/common';
import { buildingInventoryToUsableInventory } from 'src/app/shared/utils/inventory';
import { formatTimeToString } from 'src/app/shared/utils/time';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent implements OnInit, OnDestroy {
  city: any = null;
  buildings: any = [];
  buildLoading = false;
  subscriptions: Subscription[] = [];
  dialogMessage = 'init';
  snackBarOpened = false;
  setTimeoutRefs: any = [];

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: CityModel | null) => {
        if (city) {
          this.city = city;
          this.initCustomCityBuildings();
        }
      }),
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
    building.customInventory = buildingInventoryToUsableInventory(building.inventory)
  }

  setEnoughRessources(building: any) {
    building.enoughRessources = this.contains(this.city.inventory, building.inventory);
  }

  setEnoughTime(building: any) {
    building.enoughTime =
      this.cityService.userPlayerCityTime$.getValue().seconds +
        building.time * this.city.speeds.build <=
      this.cityService.defaultValues$.getValue().day_end_time;
    if (building.enoughTime) {
      const timeoutSeconds =
        (this.cityService.defaultValues$.getValue().day_end_time -
          building.time * this.city.speeds.build -
          this.cityService.userPlayerCityTime$.getValue().seconds) /
        this.cityService.defaultValues$.getValue().coef_realtime_to_ingametime;
      this.setTimeoutRefs.push(
        setTimeout(() => {
          building.enoughTime = false;
        }, timeoutSeconds * 1000),
      );
    }
  }

  setBuildingTimeString(building: any) {
    building.buildingTimeString = formatTimeToString(building.time * this.city.speeds.build);
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
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        if (result.error) {
          console.log('error');
        } else { /* empty */ }
        this.buildLoading = false;
      });
  }

  contains(inv1: any, inv2: any) { //TODO: verify code is good // utils file
    return Object.keys(inv2).every(
      key => Object.prototype.hasOwnProperty.call(inv1, key) && inv1[key] >= inv2[key],
    );
  }
  

  isBuildable(building: BuildingModel): boolean {
    if (this.city) {
      const isBuildable: boolean =
        building.enoughRessources && building.enoughTime && building.lvl < building.lvl_max;
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
