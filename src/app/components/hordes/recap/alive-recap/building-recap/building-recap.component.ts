import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';

import { BuildingRarityToIconPipe } from '../../../../../shared/pipes/building-rarity-to-icon';
import { BuildingModel, createDefaultBuildingModel, ItemModel } from 'src/app/models/hordes';
import { BuildingRecapInventoryComponent } from './building-recap-inventory/building-recap-inventory.component';

@Component({
  selector: 'app-building-recap',
  standalone: true,
  imports: [BuildingRarityToIconPipe, BuildingRecapInventoryComponent],
  templateUrl: './building-recap.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./building-recap.component.scss'],
})
export class BuildingRecapComponent {
  @Input() building: BuildingModel = createDefaultBuildingModel();

  cityService = inject(CityService);

  getTimeBuildingString() {
    return formatTimeToString(this.building.time * this.cityService.city().speeds.build);
  }

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }
}
