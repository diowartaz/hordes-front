import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLoggedInComponent } from './components/hordes/template-elements/header-logged-in/header-logged-in.component';
import { CityHeaderComponent } from './components/hordes/template-elements/city-header/city-header.component';
import { CityService } from './services/city/city.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CityHeaderComponent, HeaderLoggedInComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.cityService.loadReferencesBonuses();
  }
}
