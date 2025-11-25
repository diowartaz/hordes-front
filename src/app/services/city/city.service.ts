import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, map, Observable, tap } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class CityService {
  API_URL = environment.API_URL;
  state = signal<UserState>(UserState.NOT_LOADED_PLAYER);
  userIsLoggedIn = computed(() => {
    return [UserState.PLAYING, UserState.NO_CITY].includes(this.state());
  });

  userPlayerCityTime$: BehaviorSubject<any> = new BehaviorSubject<any>({
    string: '8h00',
    seconds: 8 * 60 * 60,
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
  digLoading = signal<boolean>(false);
  leaderboardBestDayLoading = signal<boolean>(false);
  leaderboardRankedLoading = signal<boolean>(false);
  leaderboardBestDay = signal<LeaderboardElement[]>([]);
  leaderboardRanked = signal<LeaderboardElement[]>([]);

  inventoryItemFound = signal({ wood: 0, stone: 0, metal: 0, patch: 0, screw: 0 });

  time = computed(() => {
    return this.calculateCityTime();
  });

  private calculateCityTime(): number {
    return 8 * 60 * 60;
  }

  constructor(private readonly httpClient: HttpClient) {}

  loadPlayer(): Observable<any> {
    const url: string = this.API_URL + 'player';
    return this.httpClient.get<any>(url).pipe(
      map((response: any) => {
        this.log('loadPlayer', response);
        this.state.set(response.player.state);
        this.stats.set(response.player.stats);
        this.city.set(response.player.city);
        this.defaultValues.set(response.default_values);
        this.updateTime(response.player.city);
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
        this.log('getPlayerStats', response);
        this.stats.set(response.stats);
        return response;
      }),
      catchError(handleError('getPlayerStats', url)),
    );
  }

  new(ranked: boolean): Observable<any> {
    const url: string = this.API_URL + 'city/new/';
    return this.httpClient.post<any>(url, { ranked }).pipe(
      map((response: any) => {
        this.log('new', response);
        this.city.set(response.player.city);
        this.state.set(response.player.state);
        this.updateTime(response.player.city);
        return response;
      }),
      catchError(handleError('new', url)),
    );
  }

  delete(): Observable<any> {
    const url: string = this.API_URL + 'city/delete';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('delete', response);
        this.city.set(createDefaultCityModel());
        this.state.set(UserState.NO_CITY);
        return response;
      }),
      catchError(handleError('delete', url)),
    );
  }

  findItems(nb: number): void {
    this.digLoading.set(true);
    const url: string = this.API_URL + 'city/item/find/' + nb;
    this.httpClient
      .post<any>(url, {})
      .pipe(
        map((response: any) => {
          this.log('findItems', response);
          this.city.set(response.city);
          this.updateTime(response.city);
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
          this.log('build', response);
          this.updateTime(response.city);
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
          this.log('learn', response);
          this.updateTime(response.city);
          this.city.set(response.city);
        }),
        catchError(handleError('learn', url)),
        finalize(() => {
          this.learnLoading.set(false);
        }),
      )
      .subscribe();
  }

  log(functionName: string, response: any) {
    return;
    console.log(functionName, 'response', response);
  }

  updateTime(city: any) {
    if (!this.city()) {
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      return;
    }
    const timeToAdd = Math.floor(
      ((new Date().getTime() - this.city().last_timestamp_request) * this.defaultValues().coef_realtime_to_ingametime) /
        1000,
    );
    if (city.time + timeToAdd > this.defaultValues().day_end_time) {
      //fin de journee
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      this.userPlayerCityTime$.next({
        string: formatTimeToString(this.defaultValues().day_end_time, true),
        seconds: this.defaultValues().day_end_time,
      });
      // this.endDay()
      return;
    }
    this.userPlayerCityTime$.next({
      string: formatTimeToString(city.time + timeToAdd, true),
      seconds: city.time + timeToAdd,
    });
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
    this.setInterval = setInterval(
      () => {
        this.addTime();
      },
      Math.floor((60 * 1000) / this.defaultValues().coef_realtime_to_ingametime),
    );
  }

  addTime() {
    const x = this.userPlayerCityTime$.getValue().seconds + 60;
    if (x >= this.defaultValues().day_end_time) {
      if (this.setInterval) {
        clearInterval(this.setInterval);
      }
      //fin de journee
    } else {
      this.userPlayerCityTime$.next({
        string: formatTimeToString(x, true),
        seconds: x,
      });
    }
  }

  endDay(): Observable<any> {
    const url: string = this.API_URL + 'city/day/end';
    return this.httpClient.post<any>(url, {}).pipe(
      map((response: any) => {
        this.log('endDay', response);
        this.city.set(response.player.city);
        this.stats.set(response.player.stats);
        this.state.set(response.player.state);
        return response;
      }),
      catchError(handleError('endDay', url)),
    );
  }

  startDay(whatAreTheSelectedBuildings: number[]): Observable<any> {
    const url: string = this.API_URL + 'city/day/start';
    return this.httpClient.post<any>(url, { chosen_buildings: whatAreTheSelectedBuildings }).pipe(
      map((response: any) => {
        //city
        this.log('startDay', response);
        this.city.set(response.city);
        this.state.set(UserState.PLAYING);
        this.updateTime(response.city);
        return response;
      }),
      catchError(handleError('startDay', url)),
    );
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
          console.log(response.bonuses);
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
