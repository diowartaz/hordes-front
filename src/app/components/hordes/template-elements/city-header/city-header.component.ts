import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { UserState } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-city-header',
  imports: [NgClass],
  templateUrl: './city-header.component.html',
  styleUrls: ['./city-header.component.scss'],
})
export class CityHeaderComponent {
  cityService = inject(CityService);
  headerIsDisplayed = computed(() => {
    return this.cityService.state() === UserState.PLAYING;
  });
}
