import { Component } from '@angular/core';
import { CityFooterComponent } from './template-elements/city-footer/city-footer.component';
import { RouterOutlet } from '@angular/router';
import { EffectToastComponent } from './template-elements/effect-toast/effect-toast.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
  imports: [CityFooterComponent, RouterOutlet, EffectToastComponent],
})
export class CityComponent {}
