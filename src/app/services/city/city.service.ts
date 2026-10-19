import { computed, inject, Injectable, Injector, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, interval, map, startWith, switchMap, takeWhile } from 'rxjs';
import {
  AdvancedBonus,
  AdvancedBuildingModel,
  AdvancedSkillModel,
  BonusWithoutLvl,
  BuildingModel,
  CityModel,
  createDefaultCityModel,
  createDefaultDefaultValuesModel,
  createDefaultStatsModel,
  createEmptyInventory,
  DefaultValuesModel,
  InventoryModel,
  SkillModel,
  StatsModel,
} from 'src/app/models/hordes';
import { UserState } from 'src/app/models/router';
import { computeBonuses } from 'src/app/shared/utils/bonuses';
import { calculateAdvancedBuildings } from 'src/app/shared/utils/buildings';
import { runRequest } from 'src/app/shared/utils/http';
import { calculateAdvancedSkills } from 'src/app/shared/utils/skills';
import { StorageKey, writeStorage } from 'src/app/shared/utils/storage';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { GameApiService } from '../game-api/game-api.service';

// Source de vérité de l'état de la partie. La navigation qui découle d'un changement de `state`
// est gérée par RedirectionService, jamais ici.
@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly api = inject(GameApiService);
  private readonly appInjector = inject(Injector);

  state = signal<UserState>(UserState.NOT_LOADED_PLAYER);
  playerLoaded = computed<boolean>(() => this.state() !== UserState.NOT_LOADED_PLAYER);

  referencesBonuses = signal<Record<number, BonusWithoutLvl>>({});
  defaultValues = signal<DefaultValuesModel>(createDefaultDefaultValuesModel());
  stats = signal<StatsModel>(createDefaultStatsModel());
  city = signal<CityModel>(createDefaultCityModel());
  inventoryItemFound = signal<InventoryModel>(createEmptyInventory());

  bonuses = computed<Record<number, AdvancedBonus>>(() =>
    computeBonuses(this.stats(), this.defaultValues(), this.referencesBonuses()),
  );
  nbBuyableBonuses = computed<number>(
    () => Object.values(this.bonuses()).filter((bonus) => bonus.enoughMoney && bonus.enoughLvlMax).length,
  );

  buildings = computed<BuildingModel[]>(() => this.city().buildings);
  advancedBuildings = computed<AdvancedBuildingModel[]>(() =>
    calculateAdvancedBuildings(this.city(), this.bonuses(), this.defaultValues()),
  );

  skills = computed<SkillModel[]>(() => this.city().skills);
  advancedSkills = computed<AdvancedSkillModel[]>(() =>
    calculateAdvancedSkills(this.city(), this.bonuses(), this.defaultValues()),
  );

  public cityTimeSeconds: Signal<number | undefined>;
  public cityTimeString = computed(() => formatTimeToString(this.cityTimeSeconds() || 0));

  buildLoading = signal<boolean>(false);
  learnLoading = signal<boolean>(false);
  endDayLoading = signal<boolean>(false);
  startDayLoading = signal<boolean>(false);
  deleteCityLoading = signal<boolean>(false);
  newCityLoading = signal<boolean>(false);
  digLoading = signal<boolean>(false);
  playerLoading = signal<boolean>(false);
  buyBonusLoading = signal<boolean>(false);
  referencesBonusesLoading = signal<boolean>(false);

  constructor() {
    this.cityTimeSeconds = this.setCityTimeSeconds();
  }

  // Horloge de jeu : extrapole l'heure de la ville depuis la dernière réponse du serveur
  setCityTimeSeconds() {
    return toSignal(
      toObservable(this.city, { injector: this.appInjector }).pipe(
        filter((city) => city !== null),
        switchMap((city) => {
          const coef = this.defaultValues().coef_realtime_to_ingametime;
          const realTimeRefreshRateMs = Math.floor((60 * 1000) / coef);

          // Utilise l'intervalle calculé pour mettre à jour l'horloge
          return interval(realTimeRefreshRateMs).pipe(
            startWith(0),
            map(() => {
              const realTimeDeltaMs = new Date().getTime() - city.last_timestamp_request;
              const ingameTimeDeltaSeconds = Math.floor((realTimeDeltaMs / 1000) * coef);
              const newIngameTimeSeconds = city.time + ingameTimeDeltaSeconds;
              const dayEndTime = this.defaultValues().day_end_time;

              // Vérification de la fin de journée
              const isEndOfDay = newIngameTimeSeconds >= dayEndTime;
              if (isEndOfDay && this.state() === UserState.PLAYING) {
                this.endDay();
              }
              return isEndOfDay ? dayEndTime : newIngameTimeSeconds;
            }),
            takeWhile(
              (cityTimeSeconds) =>
                this.state() === UserState.PLAYING && cityTimeSeconds < this.defaultValues().day_end_time,
              true,
            ),
          );
        }),
      ),
    );
  }

  // Remet l'état du joueur à zéro (déconnexion, changement de compte)
  reset(): void {
    this.state.set(UserState.NOT_LOADED_PLAYER);
    this.city.set(createDefaultCityModel());
    this.stats.set(createDefaultStatsModel());
    this.inventoryItemFound.set(createEmptyInventory());
  }

  loadPlayer(): void {
    runRequest(this.playerLoading, this.api.loadPlayer(), (response) => {
      this.defaultValues.set(response.default_values);
      this.stats.set(response.player.stats);
      this.city.set(response.player.city ?? createDefaultCityModel());
      this.state.set(response.player.state);
    });
  }

  findItems(nb: number): void {
    runRequest(this.digLoading, this.api.findItems(nb), (response) => {
      this.city.set(response.city);
      this.inventoryItemFound.set(response.items_found_inventory);
    });
  }

  newCity(ranked: boolean): void {
    runRequest(this.newCityLoading, this.api.newCity(ranked), (response) => {
      writeStorage(StorageKey.NB_DIG, '1');
      writeStorage(StorageKey.PLAY_ROUTE, 'dig');
      this.inventoryItemFound.set(createEmptyInventory());
      this.city.set(response.player.city);
      this.state.set(response.player.state);
    });
  }

  deleteCity(): void {
    runRequest(this.deleteCityLoading, this.api.deleteCity(), () => {
      this.city.set(createDefaultCityModel());
      this.state.set(UserState.NO_CITY);
    });
  }

  build(id: number): void {
    runRequest(this.buildLoading, this.api.build(id), (response) => this.city.set(response.city));
  }

  learn(id: number): void {
    runRequest(this.learnLoading, this.api.learn(id), (response) => this.city.set(response.city));
  }

  endDay(): void {
    runRequest(this.endDayLoading, this.api.endDay(), (response) => {
      this.city.set(response.player.city);
      this.stats.set(response.player.stats);
      this.state.set(response.player.state);
    });
  }

  startDay(chosenBuildings: number[]): void {
    runRequest(this.startDayLoading, this.api.startDay(chosenBuildings), (response) => {
      this.inventoryItemFound.set(createEmptyInventory());
      this.city.set(response.city);
      this.state.set(UserState.PLAYING);
    });
  }

  loadReferencesBonuses(): void {
    runRequest(this.referencesBonusesLoading, this.api.getReferencesBonuses(), (response) =>
      this.referencesBonuses.set(response.bonuses),
    );
  }

  buyBonus(id: number): void {
    runRequest(this.buyBonusLoading, this.api.buyBonus(id), (response) => this.stats.set(response.stats));
  }
}
