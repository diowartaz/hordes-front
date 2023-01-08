import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-leaderboard-hordes',
  templateUrl: './leaderboard-hordes.component.html',
  styleUrls: ['./leaderboard-hordes.component.scss'],
})
export class LeaderboardHordesComponent {
  getLeaderboardBestDayLoading: boolean = false;
  leaderboard: any[] = [];

  constructor(private router: Router, private cityService: CityService) {}

  ngOnInit(): void {
    this.getLeaderboardBestDay();
  }

  getLeaderboardBestDay() {
    if (this.getLeaderboardBestDayLoading) {
      return;
    }
    this.getLeaderboardBestDayLoading = true;
    this.cityService
      .getLeaderboardBestDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.getLeaderboardBestDayLoading = false;
        if (result.error) {
        } else {
          this.leaderboard = result.leaderboard;
          for (let i = 0; i < this.leaderboard.length; i++) {
            if (this.leaderboard[i].username.length > 22) {
              this.leaderboard[i].username =
                this.leaderboard[i].username.slice(0, 19) + '...';
            }
          }

          console.log('this.leaderboard', this.leaderboard);
        }
      });
  }

  goBackCityView() {
    this.router.navigate(['play']);
  }

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }
}
