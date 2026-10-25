import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { components } from 'src/app/models/api';
import {
  BonusWithoutLvl,
  BoosterCardModel,
  BoosterModel,
  CatalogBuildingModel,
  CityModel,
  DefaultValuesModel,
  GameHistoryModel,
  InventoryModel,
  LeaderboardElement,
  ProfilModel,
  StatsModel,
} from 'src/app/models/hordes';
import { UserState } from 'src/app/models/router';
import {
  ApiCatalog,
  ApiCity,
  ApiPlayer,
  ApiProfile,
  stateFromCity,
  toBonusReferences,
  toBoosterCards,
  toBoosters,
  toCatalogBuildings,
  toCityModel,
  toDefaultValues,
  toGameHistory,
  toInventory,
  toLeaderboard,
  toProfil,
  toStatsModel,
} from 'src/app/shared/utils/api-mappers';
import { environment } from 'src/environments/environment';

type Schemas = components['schemas'];

export interface PlayerSnapshot {
  accountId: string;
  username: string;
  state: UserState;
  stats: StatsModel;
  city: CityModel | null;
}

export interface GameCatalog {
  defaultValues: DefaultValuesModel;
  bonuses: Record<number, BonusWithoutLvl>;
  buildings: CatalogBuildingModel[];
  boosters: BoosterModel[];
}

export interface BoosterOpening {
  stats: StatsModel;
  cards: BoosterCardModel[];
}

export interface CityWithState {
  city: CityModel;
  state: UserState;
}

const toSnapshot = (me: Schemas['MeResponse']): PlayerSnapshot => ({
  accountId: me.account.id,
  username: me.account.username,
  state: stateFromCity(me.city),
  stats: toStatsModel(me.player),
  city: me.city ? toCityModel(me.city) : null,
});

const withState = (city: ApiCity): CityWithState => ({ city: toCityModel(city), state: stateFromCity(city) });

// Appels HTTP vers hordes-api, sans état ni effet de bord. Les réponses sont converties
// vers les modèles du front (shared/utils/api-mappers.ts).
@Injectable({ providedIn: 'root' })
export class GameApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly API_URL = environment.API_URL;

  getMe(): Observable<PlayerSnapshot> {
    return this.httpClient.get<Schemas['MeResponse']>(this.API_URL + 'me').pipe(map(toSnapshot));
  }

  getCatalog(): Observable<GameCatalog> {
    return this.httpClient.get<ApiCatalog>(this.API_URL + 'catalog').pipe(
      map((catalog) => ({
        defaultValues: toDefaultValues(catalog),
        bonuses: toBonusReferences(catalog),
        buildings: toCatalogBuildings(catalog),
        boosters: toBoosters(catalog),
      })),
    );
  }

  loadPlayer(): Observable<{ player: PlayerSnapshot; catalog: GameCatalog }> {
    return forkJoin({ player: this.getMe(), catalog: this.getCatalog() });
  }

  findItems(count: number): Observable<{ city: CityModel; found: InventoryModel }> {
    return this.httpClient
      .post<Schemas['DigResponse']>(this.API_URL + 'me/city/dig', { count })
      .pipe(map((response) => ({ city: toCityModel(response.city), found: toInventory(response.found) })));
  }

  newCity(ranked: boolean): Observable<CityWithState> {
    return this.httpClient.post<ApiCity>(this.API_URL + 'me/city', { ranked }).pipe(map(withState));
  }

  deleteCity(): Observable<unknown> {
    return this.httpClient.delete(this.API_URL + 'me/city');
  }

  build(id: number): Observable<CityModel> {
    return this.httpClient.post<ApiCity>(this.API_URL + `me/city/buildings/${id}/upgrade`, {}).pipe(map(toCityModel));
  }

  learn(id: number): Observable<CityModel> {
    return this.httpClient.post<ApiCity>(this.API_URL + `me/city/skills/${id}/upgrade`, {}).pipe(map(toCityModel));
  }

  // Fin de journée, puis relecture du joueur : gains et records changent si la ville tombe
  endDay(): Observable<PlayerSnapshot> {
    return this.httpClient.post<ApiCity>(this.API_URL + 'me/city/day/end', {}).pipe(switchMap(() => this.getMe()));
  }

  startDay(chosenBuildingIds: number[]): Observable<CityModel> {
    return this.httpClient
      .post<ApiCity>(this.API_URL + 'me/city/day/start', { chosenBuildingIds })
      .pipe(map(toCityModel));
  }

  buyBonus(id: number): Observable<StatsModel> {
    return this.httpClient.post<ApiPlayer>(this.API_URL + `me/bonuses/${id}/level-up`, {}).pipe(map(toStatsModel));
  }

  saveDeck(buildingIds: number[]): Observable<StatsModel> {
    return this.httpClient.put<ApiPlayer>(this.API_URL + 'me/deck', { buildingIds }).pipe(map(toStatsModel));
  }

  openBooster(id: number): Observable<BoosterOpening> {
    return this.httpClient
      .post<Schemas['BoosterOpeningResponse']>(this.API_URL + `me/boosters/${id}/open`, {})
      .pipe(map((response) => ({ stats: toStatsModel(response.player), cards: toBoosterCards(response.cards) })));
  }

  getLeaderboardBestDay(): Observable<LeaderboardElement[]> {
    return this.httpClient
      .get<Schemas['LeaderboardResponse']>(this.API_URL + 'leaderboards/best-day')
      .pipe(map((response) => toLeaderboard(response.entries)));
  }

  getLeaderboardRanked(): Observable<LeaderboardElement[]> {
    return this.httpClient
      .get<Schemas['LeaderboardResponse']>(this.API_URL + 'leaderboards/ranked')
      .pipe(map((response) => toLeaderboard(response.entries)));
  }

  getProfil(id: string): Observable<ProfilModel> {
    return this.httpClient.get<ApiProfile>(this.API_URL + `players/${id}/profile`).pipe(map(toProfil));
  }

  // Dernière partie terminée du joueur (écran de fin de partie)
  getLastGame(playerId: string): Observable<GameHistoryModel | undefined> {
    return this.httpClient
      .get<ApiProfile>(this.API_URL + `players/${playerId}/profile`)
      .pipe(map((profile) => (profile.matches[0] ? toGameHistory(profile.matches[0], profile) : undefined)));
  }
}
