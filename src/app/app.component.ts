import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLoggedInComponent } from './components/hordes/template-elements/header-logged-in/header-logged-in.component';
import { CityHeaderComponent } from './components/hordes/template-elements/city-header/city-header.component';
import { CityService } from './services/city/city.service';
import { RedirectionService } from './services/redirection/redirection.service';
import { CommonModule } from '@angular/common';
import { WakeUpService } from './services/wake-up/wake-up.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CityHeaderComponent, HeaderLoggedInComponent, RouterOutlet, CommonModule, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private cityService: CityService,
    private redirectionService: RedirectionService,
    public wakeUpService: WakeUpService,
  ) {}

  ngOnInit(): void {
    this.cityService.loadReferencesBonuses();
  }
}
