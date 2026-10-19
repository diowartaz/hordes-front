import { inject, Injectable, signal } from '@angular/core';
import { LeaderboardElement } from 'src/app/models/hordes';
import { runRequest } from 'src/app/shared/utils/http';
import { GameApiService } from '../game-api/game-api.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly api = inject(GameApiService);

  leaderboardBestDay = signal<LeaderboardElement[]>([]);
  leaderboardRanked = signal<LeaderboardElement[]>([]);

  leaderboardBestDayLoading = signal<boolean>(false);
  leaderboardRankedLoading = signal<boolean>(false);

  getLeaderboardBestDay(): void {
    runRequest(this.leaderboardBestDayLoading, this.api.getLeaderboardBestDay(), (response) =>
      this.leaderboardBestDay.set(response.leaderboard),
    );
  }

  getLeaderboardRanked(): void {
    runRequest(this.leaderboardRankedLoading, this.api.getLeaderboardRanked(), (response) =>
      this.leaderboardRanked.set(response.leaderboard),
    );
  }
}
