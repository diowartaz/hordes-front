import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subgame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subgame.component.html',
  styleUrls: ['./subgame.component.scss'],
})
export class SubgameComponent implements OnInit {
  @Input() subgame: any;
  @Input() win: boolean | null = false;
  @Input() ranked_points: any = null;
  @Input() otherPlayer = false;

  modifiedSubgame: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.modifiedSubgame = {
      id: this.subgame.id,
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

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }
}
