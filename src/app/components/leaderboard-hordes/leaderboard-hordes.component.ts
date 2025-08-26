import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';

@Component({
  selector: 'app-leaderboard-hordes',
  templateUrl: './leaderboard-hordes.component.html',
  styleUrls: ['./leaderboard-hordes.component.scss'],
})
export class LeaderboardHordesComponent {
  ranked: boolean = false;
  loading: boolean = false;
  leaderboard: any[] = [];

  constructor(private router: Router, private cityService: CityService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getLeaderboardBestDay();
    this.ranked = this.route.snapshot.data['ranked'] ?? false;
    console.log(this.ranked)
  }

  getLeaderboardBestDay() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    if(this.ranked){
      this.cityService
      .getLeaderboardBestDay()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.loading = false;
        if (result.error) {
        } else {
          this.leaderboard = result.leaderboard;
          for (let i = 0; i < this.leaderboard.length; i++) {
            if (this.leaderboard[i].username.length > 22) {
              this.leaderboard[i].username =
                this.leaderboard[i].username.slice(0, 19) + '...';
            }
          }
        }
      });
    } else {
      this.cityService
      .getLeaderboardRanked()
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' }))
      )
      .subscribe((result: any) => {
        this.loading = false;
        if (result.error) {
        } else {
          this.leaderboard = result.leaderboard;
          for (let i = 0; i < this.leaderboard.length; i++) {
            if (this.leaderboard[i].username.length > 22) {
              this.leaderboard[i].username =
                this.leaderboard[i].username.slice(0, 19) + '...';
            }
          }
        }
      });
    }
    
  }

  goBackCityView() {
    this.router.navigate(['play/'+ localStorage.getItem('play-route')]);
  }

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }
}
