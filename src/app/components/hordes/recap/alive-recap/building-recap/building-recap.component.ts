import { Component, inject, Input } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { BuildingModel, createDefaultBuildingModel } from 'src/app/models/hordes';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { RarityToColorPipe } from 'src/app/shared/pipes/rarity-to-color.pipe';
import { BuildingRecapInventoryComponent } from './building-recap-inventory/building-recap-inventory.component';

@Component({
  selector: 'app-building-recap',
  imports: [RarityToColorPipe, IconComponent, BuildingRecapInventoryComponent],
  templateUrl: './building-recap.component.html',
  styleUrls: ['./building-recap.component.scss'],
})
export class BuildingRecapComponent {
  @Input() building: BuildingModel = createDefaultBuildingModel();

  cityService = inject(CityService);

  getTimeBuildingString() {
    return formatTimeToString(this.building.time * this.cityService.city().speeds.build);
  }
}
