import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoutesEnum } from 'src/app/models/router';
import { LeaderboardService } from 'src/app/services/leaderboard/leaderboard.service';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-leaderboard-hordes',
  imports: [NgClass, ClassicPageComponent],
  templateUrl: './leaderboard-hordes.component.html',
  styleUrls: ['./leaderboard-hordes.component.scss'],
})
export class LeaderboardHordesComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  leaderboardService = inject(LeaderboardService);

  // L'onglet initial peut être imposé par ?ranked=true|false, puis le joueur peut en changer
  private rankedFromUrl = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('ranked'))));
  private rankedChoice = signal<boolean | undefined>(undefined);
  ranked = computed(() => this.rankedChoice() ?? this.rankedFromUrl() === 'true');

  leaderboard = computed(() =>
    this.ranked() ? this.leaderboardService.leaderboardRanked() : this.leaderboardService.leaderboardBestDay(),
  );

  ngOnInit(): void {
    this.leaderboardService.getLeaderboardRanked();
    this.leaderboardService.getLeaderboardBestDay();
  }

  goToProfil(user_id: string) {
    this.router.navigate([RoutesEnum.PROFIL], { queryParams: { user_id } });
  }

  changeRanked(ranked: boolean): void {
    this.rankedChoice.set(ranked);
  }
}
