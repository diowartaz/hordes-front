import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-recap-header',
  standalone: true,
  imports: [],
  templateUrl: './recap-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./recap-header.component.scss'],
})
export class RecapHeaderComponent {
  public cityService = inject(CityService);
}
