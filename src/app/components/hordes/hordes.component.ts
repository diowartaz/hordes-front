import { Component } from '@angular/core';
import { CityFooterComponent } from './template-elements/city-footer/city-footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hordes',
  standalone: true,
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
  imports: [CityFooterComponent, RouterOutlet],
})
export class HordesComponent {}
