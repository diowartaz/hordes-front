import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { catchError, of, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassicPageComponent } from '../classic-page.component';
import { GameHistoryModel, GameHistoryPlayerModel, ProfilModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [GameComponent, MatProgressSpinnerModule, ClassicPageComponent],
  templateUrl: './profil.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  private cityService = inject(CityService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  getProfilLoading = false;
  profil: ProfilModel | null = null;
  id = '';

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
    if (!this.id && !this.authService.userId()) {
      return;
    }
    this.getProfilLoading = true;

    this.cityService
      .getProfil(this.id || this.authService.userId())
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
