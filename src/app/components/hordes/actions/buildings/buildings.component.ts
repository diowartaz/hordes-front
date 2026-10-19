import { Component, DestroyRef, inject, signal } from '@angular/core';
import { KeyValuePipe, NgClass, NgStyle } from '@angular/common';
import { CityService } from 'src/app/services/city/city.service';
import { AdvancedBuildingModel, ItemModel } from 'src/app/models/hordes';
import { ItemIconPipe } from '../../../../shared/pipes/item-to-icon.pipe';
import { BuildingRarityToIconPipe } from '../../../../shared/pipes/building-rarity-to-icon';

@Component({
  selector: 'app-buildings',
  imports: [KeyValuePipe, NgClass, NgStyle, ItemIconPipe, BuildingRarityToIconPipe],
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent {
  cityService = inject(CityService);
  dialogMessage = signal('');
  snackBarOpened = signal(false);
  private snackBarTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.snackBarTimeout));
  }

  closeSnackBar() {
    clearTimeout(this.snackBarTimeout);
    this.snackBarOpened.set(false);
  }

  openSnackBar(message: string) {
    if (this.snackBarOpened()) {
      return;
    }
    this.dialogMessage.set(message);
    this.snackBarOpened.set(true);
    this.snackBarTimeout = setTimeout(() => this.closeSnackBar(), 1000);
  }

  build(building: AdvancedBuildingModel) {
    if (!building.enoughRessources) {
      this.openSnackBar('Not enough ressources');
      return;
    } else if ((this.cityService.cityTimeSeconds() || 0) > building.expirationCityTime) {
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
