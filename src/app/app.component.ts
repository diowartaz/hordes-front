import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLoggedInComponent } from './components/hordes/template-elements/header-logged-in/header-logged-in.component';
import { CityHeaderComponent } from './components/hordes/template-elements/city-header/city-header.component';
import { CityService } from './services/city/city.service';
import { RedirectionService } from './services/redirection/redirection.service';

import { WakeUpService } from './services/wake-up/wake-up.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IconComponent } from './shared/components/icon/icon.component';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [CityHeaderComponent, HeaderLoggedInComponent, RouterOutlet, MatProgressSpinner, IconComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private cityService = inject(CityService);
  private redirectionService = inject(RedirectionService);
  wakeUpService = inject(WakeUpService);
  // Instancié dès le démarrage pour appliquer le thème mémorisé
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.cityService.loadReferencesBonuses();
  }
}
