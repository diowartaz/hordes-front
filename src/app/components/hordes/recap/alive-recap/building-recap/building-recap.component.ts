import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { Subscription } from 'rxjs';
import { buildingInventoryToUsableInventory } from 'src/app/shared/utils/inventory';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-building-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './building-recap.component.html',
  styleUrls: ['./building-recap.component.scss'],
})
export class BuildingRecapComponent implements OnInit, OnDestroy {
  @Input() building: any = null;
  city: any = null;
  subscriptions: Subscription[] = [];

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cityService.userPlayerCity$.subscribe((city: any) => {
        this.city = city;
        this.initBuildingCustomInventory();
      }),
    );
  }

  getTimeBuildingString() {
    if (!this.city) {
      return '__h__';
    }
    return formatTimeToString(this.building.time * this.city.speeds.build);
  }

  initBuildingCustomInventory() {
    this.building.customInventory = buildingInventoryToUsableInventory(this.building.inventory);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
