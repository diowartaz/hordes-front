import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GuildOverviewModel, GuildSummaryModel } from 'src/app/models/game';
import { runRequest } from 'src/app/shared/utils/http';
import { GameApiService } from '../game-api/game-api.service';

// Guilde du joueur connecté : membres et contributions, invitations reçues, guildes publiques (écran Guild)
@Injectable({ providedIn: 'root' })
export class GuildService {
  private readonly api = inject(GameApiService);

  overview = signal<GuildOverviewModel | null>(null);
  openGuilds = signal<GuildSummaryModel[]>([]);

  loadLoading = signal<boolean>(false);
  searchLoading = signal<boolean>(false);
  // Une seule action à la fois sur la guilde (création, entrée, départ, invitation…)
  actionLoading = signal<boolean>(false);

  load(): void {
    runRequest(this.loadLoading, this.api.getGuild(), (overview) => this.setOverview(overview));
  }

  search(text: string): void {
    runRequest(this.searchLoading, this.api.searchGuilds(text), (guilds) => this.openGuilds.set(guilds));
  }

  create(name: string, isPublic: boolean, onSuccess?: () => void): void {
    this.act(this.api.createGuild(name, isPublic), onSuccess);
  }

  setPublic(isPublic: boolean): void {
    this.act(this.api.setGuildPublic(isPublic));
  }

  join(guildId: string, onSuccess?: () => void): void {
    this.act(this.api.joinGuild(guildId), onSuccess);
  }

  leave(): void {
    this.act(this.api.leaveGuild());
  }

  kick(playerId: string): void {
    this.act(this.api.kickGuildMember(playerId));
  }

  invite(username: string, onSuccess?: () => void): void {
    this.act(this.api.inviteToGuild(username), onSuccess);
  }

  accept(invitationId: string): void {
    this.act(this.api.acceptGuildInvitation(invitationId));
  }

  decline(invitationId: string): void {
    this.act(this.api.declineGuildInvitation(invitationId));
  }

  private act(request: Observable<GuildOverviewModel>, onSuccess?: () => void): void {
    runRequest(this.actionLoading, request, (overview) => {
      this.setOverview(overview);
      onSuccess?.();
    });
  }

  // Sans guilde, la liste des guildes publiques est utile : elle est rechargée
  private setOverview(overview: GuildOverviewModel): void {
    this.overview.set(overview);
    if (!overview.guild) {
      this.search('');
    }
  }
}
