import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from 'src/app/models/router';
import { CityService } from 'src/app/services/city/city.service';
import { FeatureListComponent } from 'src/app/shared/components/feature-list/feature-list.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-create-city',
  imports: [FeatureListComponent, IconComponent],
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss'],
})
export class CreateCityComponent {
  private cityService = inject(CityService);

  public readonly router = inject(Router);
  public readonly RoutesEnum = RoutesEnum;

  createCity(ranked: boolean) {
    this.cityService.newCity(ranked);
  }
}
