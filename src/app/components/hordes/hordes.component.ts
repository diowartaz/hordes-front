import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CityFooterComponent } from './template-elements/city-footer/city-footer.component';
import { RouterOutlet } from '@angular/router';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-hordes',
  standalone: true,
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CityFooterComponent, RouterOutlet],
})
export class HordesComponent {
  cityService = inject(CityService);

  generalSpeedVariation = computed(() => {
    return Math.round(-(this.cityService.city().speeds.general * 100 - 100));
  });

  generalSpeedVariationString = computed(() => {
    if (this.generalSpeedVariation() == 0) {
      return '';
    } else if (this.generalSpeedVariation() > 0) {
      return `+${this.generalSpeedVariation()}%`;
    } else {
      return `${this.generalSpeedVariation()}%`;
    }
  });
}
