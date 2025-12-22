import { Component, inject } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { RecapHeaderComponent } from '../recap-header/recap-header.component';
import { CommonModule } from '@angular/common';
import { GameComponent } from 'src/app/components/classic-page/profil/game/game.component';

@Component({
  selector: 'app-death-recap',
  standalone: true,
  imports: [RecapHeaderComponent, GameComponent, CommonModule],
  templateUrl: './death-recap.component.html',
  styleUrls: ['./death-recap.component.scss'],
})
export class DeathRecapComponent {
  public cityService = inject(CityService);
}
