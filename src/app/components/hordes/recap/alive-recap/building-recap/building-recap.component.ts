import { Component, inject, Input } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { CommonModule } from '@angular/common';
import { BuildingRarityToIconPipe } from '../../../../../shared/pipes/building-rarity-to-icon';
import { BuildingModel, createDefaultBuildingModel, ItemModel } from 'src/app/models/hordes';
import { ItemIconPipe } from '../../../../../shared/pipes/item-to-icon.pipe';

@Component({
  selector: 'app-building-recap',
  standalone: true,
  imports: [CommonModule, BuildingRarityToIconPipe, ItemIconPipe],
  templateUrl: './building-recap.component.html',
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
