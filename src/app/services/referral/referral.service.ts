import { inject, Injectable, signal } from '@angular/core';
import { ReferralModel } from 'src/app/models/game';
import { runRequest } from 'src/app/shared/utils/http';
import { clearPendingReferralCode } from 'src/app/shared/utils/referral';
import { CityService } from '../city/city.service';
import { GameApiService } from '../game-api/game-api.service';

// Parrainage du joueur connecté : code, parrain et filleuls (écran Invite friends)
@Injectable({ providedIn: 'root' })
export class ReferralService {
  private readonly api = inject(GameApiService);
  private readonly cityService = inject(CityService);

  referral = signal<ReferralModel | null>(null);
  // Don de bienvenue reçu au dernier choix de parrain, affiché jusqu'au prochain chargement
  lastGift = signal<number>(0);

  loadLoading = signal<boolean>(false);
  setSponsorLoading = signal<boolean>(false);
  removeRefereeLoading = signal<boolean>(false);
  regenerateCodeLoading = signal<boolean>(false);

  load(): void {
    this.lastGift.set(0);
    runRequest(this.loadLoading, this.api.getReferral(), (referral) => this.referral.set(referral));
  }

  setSponsor(code: string): void {
    runRequest(this.setSponsorLoading, this.api.setSponsor(code), ({ referral, giftAwarded, stats }) => {
      clearPendingReferralCode();
      this.referral.set(referral);
      this.lastGift.set(giftAwarded);
      this.cityService.stats.set(stats);
    });
  }

  removeReferee(playerId: string): void {
    runRequest(this.removeRefereeLoading, this.api.removeReferee(playerId), (referral) => this.referral.set(referral));
  }

  regenerateCode(): void {
    runRequest(this.regenerateCodeLoading, this.api.regenerateReferralCode(), (referral) =>
      this.referral.set(referral),
    );
  }
}
