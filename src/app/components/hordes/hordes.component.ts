import { Component } from '@angular/core';
import { CityFooterComponent } from './city-footer/city-footer.component';
import { CityHeaderComponent } from './city-header/city-header.component';
import { HeaderLoggedInComponent } from './header-logged-in/header-logged-in.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hordes',
  standalone: true,
  templateUrl: './hordes.component.html',
  styleUrls: ['./hordes.component.scss'],
  imports: [CityFooterComponent, CityHeaderComponent, HeaderLoggedInComponent, RouterOutlet],
})
export class HordesComponent {}
