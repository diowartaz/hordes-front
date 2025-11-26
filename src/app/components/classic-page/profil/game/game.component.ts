import { Component, Input, OnInit } from '@angular/core';
import { SubgameComponent } from './subgame/subgame.component';
import { CommonModule } from '@angular/common';
import { GameHistoryModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [SubgameComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() game!: GameHistoryModel;

  color = {
    true: 'green',
    false: 'red',
    null: '',
  };

  win: 'true' | 'false' | 'null' = 'null';

  ngOnInit(): void {
    this.win = String(this.game.win) as 'true' | 'false' | 'null';
  }
}
