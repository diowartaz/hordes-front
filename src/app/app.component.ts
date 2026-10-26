import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLoggedInComponent } from './components/hordes/template-elements/header-logged-in/header-logged-in.component';
import { CityHeaderComponent } from './components/hordes/template-elements/city-header/city-header.component';
import { CityService } from './services/city/city.service';
import { RedirectionService } from './services/redirection/redirection.service';

import { WakeUpService } from './services/wake-up/wake-up.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IconComponent } from './shared/components/icon/icon.component';
import { readStorage, StorageKey, writeStorage } from './shared/utils/storage';

// Propositions de thèmes à comparer (sélecteur temporaire, voir src/_themes.scss)
const THEMES = [
  { id: 'neon', label: 'Néon Arcade' },
  { id: 'quarantine', label: 'Quarantaine' },
  { id: 'blood', label: 'Hémorragie' },
  { id: 'signal', label: 'Signal' },
];

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
  themes = THEMES;
  theme = signal(readStorage(StorageKey.THEME) ?? 'neon');

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.theme();
      writeStorage(StorageKey.THEME, this.theme());
    });
  }

  ngOnInit(): void {
    this.cityService.loadReferencesBonuses();
  }
}
