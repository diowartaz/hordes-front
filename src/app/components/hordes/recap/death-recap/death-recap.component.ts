import { Component, computed, inject } from '@angular/core';
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

  money = computed(() => {
    return Math.floor(this.cityService.city().attackRecap.player_xp / 1.5);
  });

  bonusMoney = computed(() => {
    return this.cityService.city().attackRecap.player_xp - this.money();
  });

  tryAgain() {
    this.cityService.deleteCity();
  }
}
