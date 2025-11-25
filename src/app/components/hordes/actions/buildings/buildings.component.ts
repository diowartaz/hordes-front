import { Component, inject } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { AdvancedBuildingModel, ItemModel } from 'src/app/models/hordes';
import { CommonModule } from '@angular/common';
import { ItemIconPipe } from '../../../../shared/pipes/item-to-icon.pipe';
import { BuildingRarityToIconPipe } from '../../../../shared/pipes/building-rarity-to-icon';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, ItemIconPipe, BuildingRarityToIconPipe],
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {
  cityService = inject(CityService);
  dialogMessage = 'init';
  snackBarOpened = false;

  closeSnackBar() {
    this.snackBarOpened = false;
  }

  openSnackBar(message: string) {
    this.dialogMessage = message;
    this.snackBarOpened = true;
  }

  build(building: AdvancedBuildingModel) {
    if (!building.enoughRessources) {
      this.openSnackBar('Not enough ressources');
      return;
    } else if (!building.enoughTime) {
      this.openSnackBar('Not enough time');
      return;
    } else if (!building.enoughLvlMax) {
      this.openSnackBar('Already at max level');
      return;
    }

    this.cityService.build(building.id);
  }

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }
}
