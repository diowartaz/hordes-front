import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-shop',
  imports: [KeyValuePipe, ClassicPageComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  cityService = inject(CityService);

  buyItem(id: number) {
    this.cityService.buyBonus(id);
  }
}
