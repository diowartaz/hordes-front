import { computed, inject, Injectable, Injector, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, interval, map, Observable, switchMap, takeWhile, tap } from 'rxjs';
import { handleError } from 'src/app/shared/utils/general-functions';
import { environment } from 'src/environments/environment';
import {
  AdvancedBuildingModel,
  AdvancedBonus,
  BonusWithoutLvl,
  BuildingModel,
  CityModel,
  createDefaultCityModel,
  createDefaultDefaultValuesModel,
  createDefaultStatsModel,
  DefaultValuesModel,
  LeaderboardElement,
  SkillModel,
  StatsModel,
  AdvancedSkillModel,
} from 'src/app/models/hordes';
import { formatTimeToString } from 'src/app/shared/utils/time';
import { UserState } from 'src/app/models/router';
import { calculateAdvancedBuildings } from 'src/app/shared/utils/buildings';
import { computeBonuses } from 'src/app/shared/utils/bonuses';
import { calculateAdvancedSkills } from 'src/app/shared/utils/skills';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

interface GameTime {
  string: string;
  seconds: number;
}

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  state = signal<UserState>(UserState.NOT_LOADED_PLAYER);
  userIsLoggedIn = computed(() => {
    return [UserState.PLAYING, UserState.NO_CITY].includes(this.state());
  });

  referencesBonuses = signal<BonusWithoutLvl[]>([]);
  bonuses = computed<Record<number, AdvancedBonus>>(() => {
    return computeBonuses(this.stats(), this.defaultValues(), this.referencesBonuses());
  });

  city = signal<CityModel>(createDefaultCityModel());

  setInterval: any = null;

  buildings = computed<BuildingModel[]>(() => {
    return this.city().buildings;
  });

  advancedBuildings = computed<AdvancedBuildingModel[]>(() => {
    return calculateAdvancedBuildings(this.city(), this.bonuses(), this.defaultValues());
  });

  skills = computed<SkillModel[]>(() => {
    return this.city().skills;
  });
  advancedSkills = computed<AdvancedSkillModel[]>(() => {
    return calculateAdvancedSkills(this.city(), this.defaultValues());
  });

  defaultValues = signal<DefaultValuesModel>(createDefaultDefaultValuesModel());
  playerLoaded = signal<boolean>(false);
  stats = signal<StatsModel>(createDefaultStatsModel());

  buildLoading = signal<boolean>(false);
  learnLoading = signal<boolean>(false);
  endDayLoading = signal<boolean>(false);
  startDayLoading = signal<boolean>(false);
  deleteCityLoading = signal<boolean>(false);
  newCityLoading = signal<boolean>(false);
  digLoading = signal<boolean>(false);
  leaderboardBestDayLoading = signal<boolean>(false);
  leaderboardRankedLoading = signal<boolean>(false);

  leaderboardBestDay = signal<LeaderboardElement[]>([]);
  leaderboardRanked = signal<LeaderboardElement[]>([]);

  inventoryItemFound = signal({ wood: 0, stone: 0, metal: 0, patch: 0, screw: 0 });

  private readonly INGAME_REFRESH_SECONDS = 60;
  public userPlayerCityTime: Signal<GameTime | undefined>;
  private appInjector = inject(Injector);

  constructor(private readonly httpClient: HttpClient) {
    this.userPlayerCityTime = toSignal(
      toObservable(this.city, { injector: this.appInjector }).pipe(
        switchMap((city) => {
          const coef = this.defaultValues().coef_realtime_to_ingametime;
          const realTimeRefreshRateMs = Math.floor((60 * 1000) / coef);

          // Utilise l'intervalle calculé pour mettre à jour l'horloge
          return interval(realTimeRefreshRateMs).pipe(
            map(() => {
              const realTimeDeltaMs = new Date().getTime() - city.last_timestamp_request;
              const ingameTimeDeltaSeconds = Math.floor((realTimeDeltaMs / 1000) * coef);
              const newIngameTimeSeconds = city.time + ingameTimeDeltaSeconds;
              const dayEndTime = this.defaultValues().day_end_time;

              // Vérification de la fin de journée
              const isEndOfDay = newIngameTimeSeconds >= dayEndTime;
              if (isEndOfDay) {
                this.endDay();
              }
              const finalTimeSeconds = isEndOfDay ? dayEndTime : newIngameTimeSeconds;

              return {
                string: formatTimeToString(finalTimeSeconds, true),
                seconds: finalTimeSeconds,
              } as GameTime;
            }),
            takeWhile((time) => time.seconds < this.defaultValues().day_end_time, true),
          );
        }),
      ),
    );
  }

  loadPlayer(): Observable<any> {
    const url: string = this.API_URL + 'player';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.state.set(response.player.state);
        this.stats.set(response.player.stats);
        this.city.set(response.player.city);
        this.defaultValues.set(response.default_values);
        this.playerLoaded.set(true);
        return response;
      }),
      catchError(handleError('loadPlayer', url)),
    );
  }

  getPlayerStats(): Observable<any> {
    const url: string = this.API_URL + 'player/stats';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.stats.set(response.stats);
        return response;
      }),
      catchError(handleError('getPlayerStats', url)),
    );
  }

  newCity(ranked: boolean): void {
    if (this.newCityLoading()) {
      return;
    }
    this.newCityLoading.set(true);
    const url: string = this.API_URL + 'city/new/';
    this.httpClient
      .post<any>(url, { ranked })
      .pipe(
        map((response: any) => {
          this.city.set(response.player.city);
          this.state.set(response.player.state);
          localStorage.setItem('nb-dig', '1');
          localStorage.setItem('play-route', 'dig');
        }),
        catchError(handleError('newCity', url)),
        finalize(() => {
          this.newCityLoading.set(false);
        }),
      )
      .subscribe();
  }

  deleteCity(): void {
    if (this.deleteCityLoading()) {
      return;
    }
    this.deleteCityLoading.set(true);
    const url: string = this.API_URL + 'city/delete';
    this.httpClient
      .post<any>(url, {})
      .pipe(
        map(() => {
          this.city.set(createDefaultCityModel());
          this.state.set(UserState.NO_CITY);
        }),
        catchError(handleError('delete', url)),
        finalize(() => {
          this.deleteCityLoading.set(false);
        }),
      )
      .subscribe();
  }

  findItems(nb: number): void {
    this.digLoading.set(true);
    const url: string = this.API_URL + 'city/item/find/' + nb;
    this.httpClient
      .post<any>(url, {})
      .pipe(
        map((response: any) => {
          this.city.set(response.city);
          this.inventoryItemFound.set(response.items_found_inventory);
        }),
        catchError(handleError('findItems', url)),
        finalize(() => {
          this.digLoading.set(false);
        }),
      )
      .subscribe();
  }

  build(id: number): void {
    if (this.buildLoading()) {
      return;
    }
    this.buildLoading.set(true);
    const url: string = this.API_URL + 'city/build/' + id;

    this.httpClient
      .post<any>(url, {})
      .pipe(
        tap((response) => {
          this.city.set(response.city);
        }),
        catchError(handleError('build', url)),
        finalize(() => {
          this.buildLoading.set(false);
        }),
      )
      .subscribe();
  }

  learn(id: number): void {
    if (this.learnLoading()) {
      return;
    }
    this.learnLoading.set(true);
    const url: string = this.API_URL + 'city/learn/' + id;
    this.httpClient
      .post<any>(url, {})
      .pipe(
        tap((response) => {
          this.city.set(response.city);
        }),
        catchError(handleError('learn', url)),
        finalize(() => {
          this.learnLoading.set(false);
        }),
      )
      .subscribe();
  }

  endDay(): void {
    if (this.endDayLoading()) {
      return;
    }
    this.learnLoading.set(true);
    const url: string = this.API_URL + 'city/day/end';
    this.httpClient
      .post<any>(url, {})
      .pipe(
        map((response: any) => {
          this.city.set(response.player.city);
          this.stats.set(response.player.stats);
          this.state.set(response.player.state);
        }),
        catchError(handleError('learn', url)),
        finalize(() => {
          this.endDayLoading.set(false);
        }),
      )
      .subscribe();
  }

  startDay(whatAreTheSelectedBuildings: number[]): void {
    if (this.startDayLoading()) {
      return;
    }
    this.learnLoading.set(true);
    const url: string = this.API_URL + 'city/day/start';
    this.httpClient
      .post<any>(url, { chosen_buildings: whatAreTheSelectedBuildings })
      .pipe(
        map((response: any) => {
          this.city.set(response.city);
          this.state.set(UserState.PLAYING);
        }),
        catchError(handleError('startDay', url)),
        finalize(() => {
          this.startDayLoading.set(false);
        }),
      )
      .subscribe();
  }

  getLeaderboardBestDay(): void {
    if (this.leaderboardBestDayLoading()) {
      return;
    }
    this.leaderboardBestDayLoading.set(true);
    const url: string = this.API_URL + 'leaderboard/best-day';
    this.httpClient
      .get<any>(url)
      .pipe(
        map((response: any) => {
          this.leaderboardBestDay.set(response.leaderboard);
        }),
        catchError(handleError('getLeaderboardBestDay', url)),
        finalize(() => {
          this.leaderboardBestDayLoading.set(false);
        }),
      )
      .subscribe();
  }

  getLeaderboardRanked(): void {
    if (this.leaderboardRankedLoading()) {
      return;
    }
    this.leaderboardRankedLoading.set(true);
    const url: string = this.API_URL + 'leaderboard/ranked';
    this.httpClient
      .get<any>(url)
      .pipe(
        map((response: any) => {
          this.leaderboardRanked.set(response.leaderboard);
        }),
        catchError(handleError('getLeaderboardRanked', url)),
        finalize(() => {
          this.leaderboardRankedLoading.set(false);
        }),
      )
      .subscribe();
  }

  getProfil(id: string) {
    const url: string = this.API_URL + 'profil/' + id;
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(handleError('getProfil', url)),
    );
  }

  loadReferencesBonuses(): void {
    const url = this.API_URL + 'references/bonuses';
    this.httpClient
      .get<{ bonuses: BonusWithoutLvl[] }>(url)
      .pipe(
        tap((response) => {
          this.referencesBonuses.set(response.bonuses);
        }),
        catchError(handleError('loadReferencesBonuses', url)),
      )
      .subscribe();
  }

  buyBonus(id: number): void {
    const url: string = this.API_URL + 'player/bonuses/buy/' + id;
    this.httpClient
      .post<any>(url, {})
      .pipe(
        tap((response) => this.stats.set(response.stats)),
        catchError(handleError('buyBonus', url)),
      )
      .subscribe();
  }
}
