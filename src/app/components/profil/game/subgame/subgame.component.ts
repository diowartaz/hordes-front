import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subgame',
  templateUrl: './subgame.component.html',
  styleUrls: ['./subgame.component.scss'],
})
export class SubgameComponent {
  @Input() subgame: any;
  @Input() win: boolean | null = false;
  @Input() ranked_points: any = null;
  @Input() ranked: boolean = false;

  modifiedSubgame: any;

  constructor() {}

  ngOnInit(): void {
    this.modifiedSubgame = {
      day: this.subgame.day || '--',
      defense: this.subgame.defense || '--',
      username: this.subgame.username || '--',
      ranked_points: this.ranked_points
        ? this.win
          ? this.ranked_points
          : '-' + this.ranked_points
        : '--',
    };
  }
}
