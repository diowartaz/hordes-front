import { Component, inject } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-recap-header',
  imports: [],
  templateUrl: './recap-header.component.html',
  styleUrls: ['./recap-header.component.scss'],
})
export class RecapHeaderComponent {
  public cityService = inject(CityService);
}
