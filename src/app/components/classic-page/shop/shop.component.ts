import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { CityService } from 'src/app/services/city/city.service';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { BonusToColorPipe, BonusToIconPipe } from 'src/app/shared/pipes/bonus-to-icon.pipe';

@Component({
  selector: 'app-shop',
  imports: [KeyValuePipe, ClassicPageComponent, IconComponent, BonusToIconPipe, BonusToColorPipe],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  cityService = inject(CityService);

  // Une case de jauge par niveau
  pipsOf(count: number): number[] {
    return Array.from({ length: count });
  }

  buyItem(id: number) {
    this.cityService.buyBonus(id);
  }
}
