import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { UserState } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-city-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-header.component.html',
  styleUrls: ['./city-header.component.scss'],
})
export class CityHeaderComponent {
  cityService = inject(CityService);
  headerIsDisplayed = computed(() => {
    return [UserState.PLAYING].includes(this.cityService.state());
  });
}
