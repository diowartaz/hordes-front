import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameHistoryPlayerModel } from 'src/app/models/hordes';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-subgame',
  imports: [IconComponent],
  templateUrl: './subgame.component.html',
  styleUrls: ['./subgame.component.scss'],
})
export class SubgameComponent implements OnInit {
  private router = inject(Router);

  @Input() gameHistoryPlayer: GameHistoryPlayerModel | null = null;
  @Input() win: boolean | null = false;
  @Input() ranked_points: number | null = null;
  @Input() otherPlayer = false;

  modifiedGameHistoryPlayer: any;

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
