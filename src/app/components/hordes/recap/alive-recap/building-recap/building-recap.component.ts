import { Component, Input } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import {
  getTimeRequiredString,
} from 'src/app/shared/utils/time';
import {
  updateCustomInventory,
  getCustomInventoryDefault,
} from 'src/app/shared/utils/inventory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-building-recap',
  templateUrl: './building-recap.component.html',
  styleUrls: ['./building-recap.component.scss']
})
export class BuildingRecapComponent {
  @Input() building: any = null;
  city: any = null;
  subscriptions: Subscription[] = [];

  constructor(private cityService: CityService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        this.city = city;
        this.initBuildingCustomInventory();
      })
    );
  }

  getTimeBuildingString() {
    if (!this.city) {
      return '__h__';
    }
    return getTimeRequiredString(this.building.time * this.city.speeds.build);
  }

  initBuildingCustomInventory() {
    this.building.customInventory = [
      ...updateCustomInventory(
        getCustomInventoryDefault(),
        this.building.inventory
      ),
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
