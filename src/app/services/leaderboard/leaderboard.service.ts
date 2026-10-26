import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { LeaderboardBoard, LeaderboardPage, LeaderboardPosition } from 'src/app/models/hordes';
import { runRequest } from 'src/app/shared/utils/http';
import { GameApiService } from '../game-api/game-api.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly api = inject(GameApiService);

  // Page affichée, d'un seul classement à la fois
  page = signal<LeaderboardPage | null>(null);
  pageLoading = signal<boolean>(false);
  private pageRequest?: Subscription;
  private pageBoard?: LeaderboardBoard;

  positions = signal<Partial<Record<LeaderboardBoard, LeaderboardPosition>>>({});
  private positionLoading: Record<LeaderboardBoard, WritableSignal<boolean>> = {
    'best-day': signal(false),
    ranked: signal(false),
  };

  /** Seule la dernière page demandée est affichée : la requête précédente est annulée */
  loadPage(board: LeaderboardBoard, page: number): void {
    this.pageRequest?.unsubscribe();
    // Changement d'onglet : ne pas laisser l'autre classement affiché pendant le chargement
    if (board !== this.pageBoard) {
      this.pageBoard = board;
      this.page.set(null);
    }
    this.pageLoading.set(true);
    this.pageRequest = this.api
      .getLeaderboard(board, page)
      .pipe(finalize(() => this.pageLoading.set(false)))
      // Erreur déjà affichée par l'errorInterceptor
      .subscribe({ next: (result) => this.page.set(result), error: () => undefined });
  }

  loadMyPosition(board: LeaderboardBoard): void {
    runRequest(this.positionLoading[board], this.api.getMyLeaderboardPosition(board), (position) =>
      this.positions.update((positions) => ({ ...positions, [board]: position })),
    );
  }
}
