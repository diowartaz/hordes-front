import { Component, OnInit } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { TestService } from 'src/app/services/test/test.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any = [];
  getLeaderboardLoading: boolean = false;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.getLeaderboard();
  }

  getLeaderboard() {
    this.getLeaderboardLoading = true;
    this.testService
      .getLeaderboard()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        if (result.error) {
          this.leaderboard = [];
        } else {
          this.leaderboard = [
            { rank: 'Rank', username: 'Username', xp: 'XP' },
            ...result.leaderboard,
          ];
        }
        this.getLeaderboardLoading = false;
      });
  }
}
