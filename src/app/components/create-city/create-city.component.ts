import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-create-city',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss'],
})
export class CreateCityComponent {
  constructor(private cityService: CityService) {}

  createCity(ranked: boolean) {
    this.cityService.newCity(ranked);
  }
}
