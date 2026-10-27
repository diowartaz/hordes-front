import { Component, Input } from '@angular/core';
import { SubgameComponent } from './subgame/subgame.component';

import { GameHistoryModel, GameOutcome } from 'src/app/models/game';

const OPPOSITE: Record<GameOutcome, GameOutcome> = { win: 'loss', loss: 'win', draw: 'draw' };

@Component({
  selector: 'app-game',
  imports: [SubgameComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  @Input() game!: GameHistoryModel;

  readonly outcomeLabels: Record<GameOutcome, string> = { win: 'Victory', loss: 'Defeat', draw: 'Draw' };

  // L'issue est donnée pour player1 : l'adversaire a l'inverse
  opponentOutcome(): GameOutcome | null {
    return this.game.outcome && OPPOSITE[this.game.outcome];
  }
}
