export interface PlayerWrapperModel {
  player: PlayerModel;
}

export interface endDayModel {
  player: {
    city: CityModel;
    stats: StatsModel;
    state: string;
  };
}

export interface PlayerModel {
  city: CityModel;
  stats: StatsModel;
}

export interface CityWrapperModel {
  city: CityModel;
}

export function createDefaultStatsModel(): StatsModel {
  return {
    personal_best_day: 0,
    personal_best_zb: 0,
    xp: 0,
    money: 0,
    bonuses: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, 0])),
    match_history: [],
    ranked_points: 500,
  };
}

export interface StatsModel {
  personal_best_day: number;
  personal_best_zb: number;
  xp: number;
  money: number;
  bonuses: Record<number, number>;
  ranked_points: number;
  match_history: any[];
}

export type ItemModel = 'wood' | 'stone' | 'screw' | 'metal' | 'patch';

export function createDefaultCityModel(): CityModel {
  return {
    day: 0,
    defense: 0,
    time: 0,
    nb_zb_next_attack_max: 0,
    nb_zb_next_attack_min: 0,
    nb_zb_previous_attack: 0,
    buildings: [],
    skills: [],
    nb_zb_history: [],
    inventory: { wood: 0, stone: 0, screw: 0, metal: 0, patch: 0 },
    speeds: {
      build: 0,
      dig: 0,
      learn: 0,
      insomniac: 0,
    },
    last_timestamp_request: new Date().getTime(),
    state: 'noCity',
    attackRecap: {
      architect_shelter_buildings: [],
      library_discoveries: {},
      nb_zb: 0,
      defense: 0,
      player_xp: 0,
      day: 0,
    },

    defaultCity: true,
  };
}

export interface CityModel {
  day: number;
  defense: number;
  time: number;
  nb_zb_next_attack_max: number;
  nb_zb_next_attack_min: number;
  nb_zb_previous_attack: number;
  buildings: BuildingModel[];
  skills: SkillModel[];
  nb_zb_history: number[];
  last_timestamp_request: number;
  inventory: { wood: number; stone: number; screw: number; metal: number; patch: number };
  speeds: SpeedsModel;
  state: string;
  attackRecap: AttackRecapModel;
  defaultCity?: boolean;
}

export interface AttackRecapModel {
  architect_shelter_buildings: BuildingModel[];
  library_discoveries: Record<number, number>;
  nb_zb: number;
  defense: number;
  player_xp: number;
  day: number;
}

export interface SpeedsModel {
  build: number;
  dig: number;
  learn: number;
  insomniac: number;
}

export function createDefaultBuildingModel(): BuildingModel {
  return {
    id: 1,
    defense: 50,
    time: 3600,
    lvl: 2,
    lvl_max: 5,
    name: 'Wooden Shelter',
    inventory: {
      wood: 10,
      stone: 5,
      metal: 2,
    },
    rarity: 'common',
    selected: false,
  };
}

export interface BuildingModel {
  id: number;
  defense: number;
  time: number;
  lvl: number;
  lvl_max: number;
  name: string;
  inventory: Record<string, number>;
  rarity: 'base' | 'common' | 'rare' | 'epic';
  selected: boolean;
}

export interface AdvancedBuildingModel {
  id: number;
  defense: number;
  time: number;
  lvl: number;
  lvl_max: number;
  name: string;
  inventory: Record<string, number>;
  buildingTimeString: string;
  rarity: 'base' | 'common' | 'rare' | 'epic';
  selected: boolean;
  enoughRessources: boolean;
  enoughTime: boolean;
  enoughLvlMax: boolean;
  timeoutSeconds: number;
}

export interface SkillModel {
  id: number;
  name: string;
  speed_name: string;
  lvl: number;
  lvl_max: number;
  lvl_max_max: number;
  time: number;
  avantage_per_lvl: number;
  reduce_time_seconds: number;
}

export interface customInventoryModel {
  found: number;
  nb: number;
  src: string;
  name: string;
}

export interface XPToLVL {
  lvl: string;
  xpString: string;
  ratio: number;
}
export interface ProfilModel {
  username: string;
  rank: number;
  xp: number;
  creation_date: string;
  personal_best_day: number;
  personal_best_zb: number;
  last_10_games: GameHistoryModel[];
}

export interface GameHistoryModel {
  date: string;
  zb: number;
  day: number;
  defense: number;
}

export interface LeaderboardPlayerModel {
  username: string;
  user_id: string;
  personal_best_day: number;
  personal_best_zb: number;
  rank: number;
}

export interface DeleteModel {
  message: string;
}

export interface FindItemsModel {
  city: CityModel;
  items_found_inventory: Record<string, number>;
}

export interface LoadPlayerModel {
  player: PlayerStateModel;
  default_values: DefaultValuesModel;
}

export interface PlayerStateModel {
  stats: {
    xp: number;
    personal_best_day: number;
    personal_best_zb: number;
    last_10_games: GameHistoryModel[];
  };
  state: string;
  city: null | CityModel;
}

export interface DefaultValuesModel {
  newCity: CityModel;
  items: string[];
  day_start_time: number;
  day_end_time: number;
  digging_time: number;
  coef_realtime_to_ingametime: number;
  buildings: BuildingBackendModel[];
  LEVELED_PROBA_RESSOURCES: LeveledProbaModel[];
  nb_buildings_start: number;
  nb_skills_start: number;
  probaBuildingDiscovery: number;
  probaSkillDiscovery: number;
  randomPercentageDefBuilding: number;
  bonuses: Record<string, BonusWithoutLvl>;
  SKILL_TIME_MULTIPLIER: number;
  BONUS_PRICE_MULTIPLIER: number;
  ZOMBIE_COEF_MIN: number;
  ZOMBIE_COEF_MAX: number;
  ARCHITECT_DISCOVERY_CHOICES: number;
}

export interface LeveledProbaModel {
  object: string;
  nb: number;
}

export interface BuildingInventoryModel {
  wood: number;
  metal: number;
  screw: number;
}

export interface BuildingBackendModel {
  id: number;
  rarity: string;
  name: string;
  defense: number;
  lvl: number;
  lvl_max: number;
  time: number;
  inventory: BuildingInventoryModel;
}

export interface CityTimeModel {
  secondsTosString: number;
  seconds: string;
}

export function createDefaultDefaultValuesModel(): DefaultValuesModel {
  return {
    newCity: {
      day: 1,
      defense: 20,
      buildings: [],
      skills: [],
      nb_zb_history: [],
      nb_zb_previous_attack: 9,
      nb_zb_next_attack_min: 11,
      nb_zb_next_attack_max: 13,
      time: 28800,
      inventory: {
        wood: 0,
        stone: 0,
        screw: 0,
        metal: 0,
        patch: 0,
      },
      speeds: {
        build: 1,
        learn: 1,
        dig: 1,
        insomniac: 1,
      },
      attackRecap: {
        architect_shelter_buildings: [],
        library_discoveries: {},
        nb_zb: 0,
        defense: 0,
        player_xp: 0,
        day: 0,
      },
      last_timestamp_request: 0,
      state: 'playing',
    },
    items: ['wood', 'metal', 'stone', 'screw', 'patch'],
    day_start_time: 28800,
    day_end_time: 86459,
    digging_time: 7200,
    coef_realtime_to_ingametime: 192,
    buildings: [],
    nb_buildings_start: 7,
    nb_skills_start: 9,
    probaBuildingDiscovery: 0.7,
    probaSkillDiscovery: 0.5,
    randomPercentageDefBuilding: 20,
    LEVELED_PROBA_RESSOURCES: [],
    bonuses: {},
    SKILL_TIME_MULTIPLIER: 1.5,
    BONUS_PRICE_MULTIPLIER: 1.5,
    ZOMBIE_COEF_MIN: 2,
    ZOMBIE_COEF_MAX: 4,
    ARCHITECT_DISCOVERY_CHOICES: 2,
  };
}

export interface BonusWithoutLvl {
  id: number;
  name: string;
  description: string;
  icon: string;
  price: number;
  lvl_max: number;
  value: number;
}

export interface AdvancedBonus {
  id: number;
  name: string;
  description: string;
  icon: string;
  price: number;
  lvl: number;
  lvl_max: number;
  value: number;
  enoughMoney: boolean;
  enoughLvlMax: boolean;
}

export interface LeaderboardElement {
  username: string;
  username_truncated: string;
  user_id: string;
  personal_best_day: number;
  personal_best_zb: number;
  rank: number;
  ranked_points: number;
}
