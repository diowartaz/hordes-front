import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { CityService } from 'src/app/services/city/city.service';
import { AdvancedBonus } from 'src/app/models/hordes';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  bonuses: AdvancedBonus[] = [];
  Math = Math;
  constructor(public cityService: CityService) {}

  buyItem(id: number) {
    this.cityService.buyBonus(id);
  }
}
