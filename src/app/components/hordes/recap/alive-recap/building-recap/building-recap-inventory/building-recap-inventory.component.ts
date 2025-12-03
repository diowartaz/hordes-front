import { Component, inject, Input } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { CommonModule } from '@angular/common';
import { BuildingModel, createDefaultBuildingModel, ItemModel } from 'src/app/models/hordes';
import { ItemIconPipe } from '../../../../../../shared/pipes/item-to-icon.pipe';

@Component({
  selector: 'app-building-recap-inventory-inventory',
  standalone: true,
  imports: [CommonModule, ItemIconPipe],
  templateUrl: './building-recap-inventory.component.html',
  styleUrls: ['./building-recap-inventory.component.scss'],
})
export class BuildingRecapInventoryComponent {
  @Input() building: BuildingModel = createDefaultBuildingModel();

  cityService = inject(CityService);

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }
}
