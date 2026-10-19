import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLoggedInComponent } from './components/hordes/template-elements/header-logged-in/header-logged-in.component';
import { CityHeaderComponent } from './components/hordes/template-elements/city-header/city-header.component';
import { CityService } from './services/city/city.service';
import { RedirectionService } from './services/redirection/redirection.service';

import { WakeUpService } from './services/wake-up/wake-up.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CityHeaderComponent, HeaderLoggedInComponent, RouterOutlet, MatProgressSpinner],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private cityService = inject(CityService);
  private redirectionService = inject(RedirectionService);
  wakeUpService = inject(WakeUpService);

  ngOnInit(): void {
    this.cityService.loadReferencesBonuses();
  }
}
