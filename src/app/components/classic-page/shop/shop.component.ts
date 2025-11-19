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
  constructor(public cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.userPlayerStats$.subscribe((stats) => {
      this.money = stats.money;
    });
  }

  buyItem(id: number) {
    this.cityService.buyBonus(id);
  }
}
