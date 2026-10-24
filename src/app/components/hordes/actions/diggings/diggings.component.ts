import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { CityService } from 'src/app/services/city/city.service';
import { ItemModel } from 'src/app/models/hordes';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { ResourceGemComponent } from 'src/app/shared/components/resource-gem/resource-gem.component';
import { ItemToColorPipe } from 'src/app/shared/pipes/item-to-color.pipe';
import { bonusEffect } from 'src/app/shared/utils/bonuses';
import { enoughTime, formatTimeToString } from 'src/app/shared/utils/time';
import { readStorage, StorageKey, writeStorage } from 'src/app/shared/utils/storage';

@Component({
  selector: 'app-diggings',
  imports: [KeyValuePipe, IconComponent, ResourceGemComponent, ItemToColorPipe],
  templateUrl: './diggings.component.html',
  styleUrls: ['./diggings.component.scss'],
})
export class DiggingsComponent {
  cityService = inject(CityService);

  dialogMessage = signal('');
  snackBarOpened = signal(false);
  nbDigs = signal(Number(readStorage(StorageKey.NB_DIG)) || 1);
  private snackBarTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.snackBarTimeout));
  }

  totalRequiredTime = computed(() => {
    const flatBonusMinutes = bonusEffect(this.cityService.bonuses()[6]);
    const percentBonus = bonusEffect(this.cityService.bonuses()[7]);
    const { dig, general } = this.cityService.city().speeds;
    return (
      this.nbDigs() *
      (this.cityService.defaultValues().digging_time * dig * general * (1 - percentBonus) - flatBonusMinutes * 60)
    );
  });

  totalRequiredTimeString = computed(() => formatTimeToString(this.totalRequiredTime()));

  // Heure de la ville à la fin des fouilles
  endTimeString = computed(() =>
    formatTimeToString((this.cityService.cityTimeSeconds() || 0) + this.totalRequiredTime()),
  );

  enoughTime = computed(() =>
    enoughTime(
      this.totalRequiredTime(),
      this.cityService.cityTimeSeconds(),
      this.cityService.defaultValues().day_end_time,
    ),
  );

  disableMinusDigs = computed(() => this.nbDigs() - 1 < 1);

  addDigs(nb: number) {
    this.nbDigs.set(Math.max(this.nbDigs() + nb, 1));
    writeStorage(StorageKey.NB_DIG, this.nbDigs().toString());
  }

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }

  openSnackBar(message: string) {
    if (this.snackBarOpened()) {
      return;
    }
    this.dialogMessage.set(message);
    this.snackBarOpened.set(true);
    this.snackBarTimeout = setTimeout(() => this.closeSnackBar(), 1000);
  }

  closeSnackBar() {
    clearTimeout(this.snackBarTimeout);
    this.snackBarOpened.set(false);
  }

  dig() {
    if (!this.enoughTime()) {
      this.openSnackBar('Not enough time');
      return;
    }
    this.cityService.findItems(this.nbDigs());
  }
}
