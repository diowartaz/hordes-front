import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { CityService } from 'src/app/services/city/city.service';
import { AdvancedBonus } from 'src/app/models/hordes';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './shop.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  cityService = inject(CityService);

  bonuses: AdvancedBonus[] = [];
  Math = Math;

  buyItem(id: number) {
    this.cityService.buyBonus(id);
  }
}
