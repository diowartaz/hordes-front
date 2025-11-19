import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-leaderboard-hordes',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './leaderboard-hordes.component.html',
  styleUrls: ['./leaderboard-hordes.component.scss'],
})
export class LeaderboardHordesComponent implements OnInit {
  ranked = true;
  loading = false;
  leaderboard: any[] = [];

  constructor(
    private router: Router,
    private cityService: CityService,
  ) {}

  ngOnInit(): void {
    this.getLeaderboardRanked();
  }

  getLeaderboardBestDay() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    this.cityService
      .getLeaderboardBestDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        this.loading = false;
        if (result.error) {
          /* empty */
        } else {
          this.leaderboard = result.leaderboard;
          for (const leaderboardElement of this.leaderboard) {
            if (leaderboardElement.username.length > 22) {
              leaderboardElement.username = leaderboardElement.username.slice(0, 19) + '...';
            }
          }
        }
      });
  }

  getLeaderboardRanked() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.cityService
      .getLeaderboardRanked()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: any) => {
        this.loading = false;
        if (result.error) {
          /* empty */
        } else {
          this.leaderboard = result.leaderboard;
          for (const leaderboardElement of this.leaderboard) {
            if (leaderboardElement.username.length > 22) {
              leaderboardElement.username = leaderboardElement.username.slice(0, 19) + '...';
            }
          }
        }
      });
  }

  goBackCityView() {
    this.router.navigate(['play/' + localStorage.getItem('play-route')]);
  }

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }

  changeRanked(ranked: boolean): void {
    this.ranked = ranked;
    if (ranked) {
      this.getLeaderboardRanked(); //TDOO: ne pas refaire l'appel
    } else {
      this.getLeaderboardBestDay();
    }
  }
}
