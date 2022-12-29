import { Component, Input } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import {
  getTimeRequiredString,
  getTimeString,
} from 'src/app/shared/utils/time';
import {
  updateCustomInventory,
  getCustomInventoryDefault,
} from 'src/app/shared/utils/inventory';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent {
  @Input() building: any = null;
  city: any = null;

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userPlayerCity$.subscribe((city: any) => {
      this.city = city;
      this.initBuildingCustomInventory();
    });
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
}
