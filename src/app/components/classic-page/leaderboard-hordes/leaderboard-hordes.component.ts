import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ranked = false;

  constructor(
    private router: Router,
    public cityService: CityService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.ranked) {
        this.ranked = queryParams.ranked === 'false' ? false : true;
      }
    });
    this.cityService.getLeaderboardRanked();
    this.cityService.getLeaderboardBestDay();
  }

  goBackCityView() {
    this.router.navigate(['play/' + localStorage.getItem('play-route')]);
  }

  goToProfil(user_id: string) {
    this.router.navigate(['profil'], { queryParams: { user_id } });
  }

  changeRanked(ranked: boolean): void {
    this.ranked = ranked;
  }
}
