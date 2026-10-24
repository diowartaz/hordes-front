import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { LeaderboardElement } from 'src/app/models/hordes';
import { RoutesEnum } from 'src/app/models/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaderboardService } from 'src/app/services/leaderboard/leaderboard.service';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-leaderboard-hordes',
  imports: [ClassicPageComponent, IconComponent],
  templateUrl: './leaderboard-hordes.component.html',
  styleUrls: ['./leaderboard-hordes.component.scss'],
})
export class LeaderboardHordesComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  leaderboardService = inject(LeaderboardService);
  authService = inject(AuthService);

  // L'onglet initial peut être imposé par ?ranked=true|false, puis le joueur peut en changer
  private rankedFromUrl = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('ranked'))));
  private rankedChoice = signal<boolean | undefined>(undefined);
  ranked = computed(() => this.rankedChoice() ?? this.rankedFromUrl() === 'true');

  leaderboard = computed(() =>
    this.ranked() ? this.leaderboardService.leaderboardRanked() : this.leaderboardService.leaderboardBestDay(),
  );

  // Podium affiché dans l'ordre 2 - 1 - 3
  podium = computed(() => {
    const [first, second, third] = this.leaderboard();
    return [second, first, third].filter((user): user is LeaderboardElement => !!user);
  });
  others = computed(() => this.leaderboard().slice(3));
  me = computed(() => this.leaderboard().find((user) => user.user_id === this.authService.userId()));

  private bestScore = computed(() => Math.max(1, ...this.leaderboard().map((user) => this.rawScore(user))));

  ngOnInit(): void {
    this.leaderboardService.getLeaderboardRanked();
    this.leaderboardService.getLeaderboardBestDay();
  }

  private rawScore(user: LeaderboardElement): number {
    return this.ranked() ? user.ranked_points : user.personal_best_day;
  }

  scoreOf(user: LeaderboardElement): string {
    return this.ranked()
      ? `${user.ranked_points} pts`
      : `${user.personal_best_day} d · ${user.personal_best_zb.toLocaleString('fr-FR')}`;
  }

  // Remplissage de la jauge, relatif au premier du classement
  ratioOf(user: LeaderboardElement): number {
    return Math.round((this.rawScore(user) / this.bestScore()) * 100);
  }

  goToProfil(user_id: string) {
    this.router.navigate([RoutesEnum.PROFIL], { queryParams: { user_id } });
  }

  changeRanked(ranked: boolean): void {
    this.rankedChoice.set(ranked);
  }
}
