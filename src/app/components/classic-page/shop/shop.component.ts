import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { CityService } from 'src/app/services/city/city.service';
import { Bonus } from 'src/app/models/hordes';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  bonuses: Bonus[] = [];
  Math = Math;
  money = 0;
  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userPlayerStats$.subscribe((stats) => {
      this.money = stats.money;
      this.calculateBonuses();
    });
    this.cityService.referencesBonuses$.subscribe(() => {
      this.calculateBonuses();
    });
  }

  calculateBonuses(): void {
    if (
      Object.keys(this.cityService.userPlayerStats$.getValue().bonuses).length > 0 &&
      Object.keys(this.cityService.referencesBonuses$.getValue()).length > 0
    ) {
      this.bonuses = [];
      for (const referencesBonusId in this.cityService.referencesBonuses$.getValue()) {
        this.bonuses.push({
          ...this.cityService.referencesBonuses$.getValue()[referencesBonusId],
          lvl: this.cityService.userPlayerStats$.getValue().bonuses[referencesBonusId],
        });
      }
    } else {
      this.bonuses = [];
    }
  }

  buyItem(item: Bonus) {
    this.cityService.buyBonus(item.id);
  }
}
