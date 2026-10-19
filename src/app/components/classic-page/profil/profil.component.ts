import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameApiService } from 'src/app/services/game-api/game-api.service';
import { GameComponent } from './game/game.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassicPageComponent } from '../classic-page.component';
import { GameHistoryPlayerModel, ProfilModel } from 'src/app/models/hordes';

@Component({
  selector: 'app-profil',
  imports: [GameComponent, MatProgressSpinnerModule, ClassicPageComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  private api = inject(GameApiService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  getProfilLoading = signal(false);
  profil = signal<ProfilModel | null>(null);

  // Historique du plus récent au plus ancien, avec le résultat calculé pour le joueur 1
  matchHistory = computed(() =>
    (this.profil()?.match_history ?? [])
      .map((match) => ({ ...match, win: this.player1Wins(match.player1, match.player2) }))
      .reverse(),
  );

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          const id = params.get('user_id') || this.authService.userId();
          this.profil.set(null);
          if (!id) {
            return EMPTY;
          }
          this.getProfilLoading.set(true);
          return this.api.getProfil(id).pipe(
            // l'erreur est affichée par l'errorInterceptor ; on garde l'écoute des paramètres active
            catchError(() => EMPTY),
            finalize(() => this.getProfilLoading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.profil.set(result.profil));
  }

  player1Wins(player1: GameHistoryPlayerModel, player2: GameHistoryPlayerModel | null) {
    if (player2 === null) {
      return null;
    }
    return player1.defense >= player2.defense;
  }
}
