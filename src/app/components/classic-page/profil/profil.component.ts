import { Component, OnInit } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassicPageComponent } from '../classic-page.component';
import { GameHistoryModel, GameHistoryPlayerModel, ProfilModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, GameComponent, MatProgressSpinnerModule, ClassicPageComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  getProfilLoading = false;
  profil: any = null;
  id = '';

  constructor(
    private cityService: CityService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.user_id) {
        this.id = queryParams.user_id;
        this.getProfil();
      }
    });
  }

  player1Wins(player1: GameHistoryPlayerModel, player2: GameHistoryPlayerModel | null) {
    if (player2 === null) {
      return null;
    }
    return player1.defense >= player2.defense;
  }

  getProfil() {
    this.getProfilLoading = true;
    if (this.id == '') {
      this.id = this.authService.getUserId() || '';
    }

    this.cityService
      .getProfil(this.id)
      .pipe(
        take(1),
        catchError(() => of({ error: 'error' })),
      )
      .subscribe((result: { profil: ProfilModel }) => {
        this.profil = result.profil;
        this.profil.match_history.forEach((match: GameHistoryModel) => {
          match.win = this.player1Wins(match.player1, match.player2);
        });
        this.getProfilLoading = false;
      });
  }

  goBack() {
    this.location.back();
  }
}
