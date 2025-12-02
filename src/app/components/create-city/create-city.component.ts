import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { RoutesEnum } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-create-city',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss'],
})
export class CreateCityComponent {
  public readonly router = inject(Router);
  public readonly RoutesEnum = RoutesEnum;
  constructor(private cityService: CityService) {}

  createCity(ranked: boolean) {
    this.cityService.newCity(ranked);
  }
}
