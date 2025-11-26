import { Component, computed, inject, signal } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { CommonModule } from '@angular/common';
import { ItemModel } from 'src/app/models/hordes';
import { ItemIconPipe } from '../../../../shared/pipes/item-to-icon.pipe';
import { enoughTime, formatTimeToString } from 'src/app/shared/utils/time';

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

  totalRequiredTime = computed(() => {
    const flatBonus = this.cityService.bonuses()[6];
    const percentBonus = this.cityService.bonuses()[7];
    return (
      this.nbDigs() *
      (this.cityService.defaultValues().digging_time *
        this.cityService.city().speeds.dig *
        (1 - percentBonus.value * percentBonus.lvl) -
        flatBonus.value * flatBonus.lvl * 60)
    );
  });

  totalRequiredTimeString = computed(() => {
    return formatTimeToString(this.totalRequiredTime(), false);
  });

  enoughTime = computed(() => {
    return enoughTime(
      this.totalRequiredTime(),
      this.cityService.userPlayerCityTime()?.seconds,
      this.cityService.defaultValues().day_end_time,
    );
  });

  disableMinusDigs = computed(() => {
    return this.nbDigs() - 1 < 1;
  });

  addDigs(nb: number) {
    this.nbDigs.set(Math.max(this.nbDigs() + nb, 1));
    localStorage.setItem('nb-dig', this.nbDigs.toString());
  }

  castKey(key: string): ItemModel {
    return key as ItemModel;
  }

  dig() {
    this.cityService.findItems(this.nbDigs());
  }
}
