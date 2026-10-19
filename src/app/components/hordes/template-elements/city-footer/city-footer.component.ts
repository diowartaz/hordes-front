import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlayRoute, readPlayRoute, RoutesEnum } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';
import { StorageKey, writeStorage } from 'src/app/shared/utils/storage';

@Component({
  selector: 'app-city-footer',
  imports: [NgClass],
  templateUrl: './city-footer.component.html',
  styleUrls: ['./city-footer.component.scss'],
})
export class CityFooterComponent {
  private router = inject(Router);
  cityService = inject(CityService);

  content = signal<PlayRoute>(readPlayRoute());

  changeContent(content: PlayRoute) {
    this.content.set(content);
    writeStorage(StorageKey.PLAY_ROUTE, content);
    this.router.navigate([RoutesEnum.PLAY, content]);
  }
}
