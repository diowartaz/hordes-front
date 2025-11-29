import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameHistoryPlayerModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-subgame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subgame.component.html',
  styleUrls: ['./subgame.component.scss'],
})
export class SubgameComponent implements OnInit {
  @Input() gameHistoryPlayer: GameHistoryPlayerModel | null = null;
  @Input() win: boolean | null = false;
  @Input() ranked_points: number | null = null;
  @Input() otherPlayer = false;

  modifiedGameHistoryPlayer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.modifiedGameHistoryPlayer = {
      id: this.gameHistoryPlayer?.id || '--',
      day: this.gameHistoryPlayer?.day || '--',
      defense: this.gameHistoryPlayer?.defense || '--',
      username: this.gameHistoryPlayer?.username || '--',
      ranked_points: this.ranked_points ? (this.win ? this.ranked_points : '-' + this.ranked_points) : '--',
    };
  }

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }
}
