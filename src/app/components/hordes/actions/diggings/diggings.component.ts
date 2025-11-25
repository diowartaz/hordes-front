import { Component, inject, signal } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { CommonModule } from '@angular/common';
import { ItemModel } from 'src/app/models/hordes';
import { ItemIconPipe } from '../../../../shared/pipes/item-to-icon.pipe';

@Component({
  selector: 'app-diggings',
  standalone: true,
  imports: [CommonModule, ItemIconPipe],
  templateUrl: './diggings.component.html',
  styleUrls: ['./diggings.component.scss'],
})
export class DiggingsComponent {
  cityService = inject(CityService);
  nbDigs = signal(Number(localStorage.getItem('nb-dig')) || 1);
  digLoading = false;
  initDone = false;

  addDigs(nb: number) {
    this.nbDigs.set(Math.max(this.nbDigs() + nb, 1));
    localStorage.setItem('nb-dig', this.nbDigs.toString());
  }

  disableMinusDigs(): boolean {
    return this.nbDigs() - 1 < 1;
  }

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }

  getDiggingsTime(): number {
    const flatBonus = this.cityService.bonuses()[6];
    const percentBonus = this.cityService.bonuses()[7];
    return this.cityService.city()
      ? this.nbDigs() *
          (this.cityService.defaultValues().digging_time *
            this.cityService.city().speeds.dig *
            (1 - percentBonus.value * percentBonus.lvl) -
            flatBonus.value * flatBonus.lvl * 60)
      : 2 * 60 * 60;
  }

  getDiggingsTimeString() {
    return formatTimeToString(this.getDiggingsTime());
  }

  digDisabled(): boolean {
    if (!this.cityService.city()) {
      return true;
    }
    return this.getDiggingsTime() + this.cityService.city().time > this.cityService.defaultValues().day_end_time;
  }

  dig() {
    if (this.cityService.digLoading() || this.digDisabled()) {
      return;
    }
    this.cityService.findItems(this.nbDigs());
  }
}
