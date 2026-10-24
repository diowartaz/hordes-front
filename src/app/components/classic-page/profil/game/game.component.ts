import { Component, Input } from '@angular/core';
import { SubgameComponent } from './subgame/subgame.component';

import { GameHistoryModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-game',
  imports: [SubgameComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  @Input() game!: GameHistoryModel;
}
