// ---------- Modèles du jeu ----------

export function createDefaultStatsModel(): StatsModel {
  return {
    personal_best_day: 0,
    personal_best_zb: 0,
    xp: 0,
    money: 0,
    bonuses: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, 0])),
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
}

export type ItemModel = 'wood' | 'stone' | 'screw' | 'metal' | 'patch';

export type InventoryModel = Record<ItemModel, number>;

export function createEmptyInventory(): InventoryModel {
  return { wood: 0, stone: 0, screw: 0, metal: 0, patch: 0 };
}

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
    inventory: createEmptyInventory(),
    speeds: {
      build: 1,
      dig: 1,
      learn: 1,
      insomniac: 1,
    },
    last_timestamp_request: new Date().getTime(),
    state: 'noCity',
    attackRecap: {
      architect_shelter_buildings: [],
      building_picks: 0,
      library_discoveries: {},
      nb_zb: 0,
      defense: 0,
      base_money: 0,
      bonus_money: 0,
      ranked_money: 0,
      total_money: 0,
      day: 0,
    },
    ranked: false,
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
  inventory: InventoryModel;
  speeds: SpeedsModel;
  state: string;
  attackRecap: AttackRecapModel;
  defaultCity?: boolean;
  ranked: boolean;
}

export interface AttackRecapModel {
  architect_shelter_buildings: BuildingModel[];
  // Nombre maximum de bâtiments à garder parmi architect_shelter_buildings
  building_picks: number;
  library_discoveries: Record<number, number>;
  nb_zb: number;
  defense: number;
  base_money: number;
  bonus_money: number;
  ranked_money: number;
  total_money: number;
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
    defense_ratio_percentage: -22,
  };
}

export type Rarity = 'base' | 'common' | 'rare' | 'epic' | 'legendary';

export interface BuildingModel {
  id: number;
  defense: number;
  time: number;
  lvl: number;
  lvl_max: number;
  name: string;
  inventory: Record<string, number>;
  rarity: Rarity;
  selected: boolean;
  defense_ratio_percentage: number;
}

export interface AdvancedBuildingModel {
  id: number;
  defense: number;
  time: number;
  lvl: number;
  lvl_max: number;
  name: string;
  inventory: Record<string, number>;
  timeString: string;
  rarity: Rarity;
  selected: boolean;
  enoughRessources: boolean;
  enoughLvlMax: boolean;
  expirationCityTime: number;
  defense_ratio_percentage: number;
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

export interface AdvancedSkillModel {
  id: number;
  name: string;
  speed_name: string;
  lvl: number;
  lvl_max: number;
  lvl_max_max: number;
  time: number;
  avantage_per_lvl: number;
  reduce_time_seconds: number;
  timeString: string;
  enoughLvlMax: boolean;
  percentageEfficacityStringBefore: string;
  percentageEfficacityStringAfter: string;
  expirationCityTime: number;
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
  match_history: GameHistoryModel[];
}

export interface GameHistoryPlayerModel {
  day: number;
  defense: number;
  id: string;
  nb_zb: number;
  username: string;
}

/** Issue d'une partie ranked, calculée par l'API */
export type GameOutcome = 'win' | 'loss' | 'draw';

export interface GameHistoryModel {
  date: string;
  player1: GameHistoryPlayerModel;
  player2: GameHistoryPlayerModel | null;
  ranked: boolean;
  ranked_points: number | null;
  /** Issue pour player1 ; null hors ranked ou tant que l'adversaire n'a pas terminé */
  outcome: GameOutcome | null;
  /** Partie réglée par l'inactivité d'un des deux joueurs */
  forfeit: boolean;
}

export interface DefaultValuesModel {
  items: string[];
  day_start_time: number;
  day_end_time: number;
  digging_time: number;
  coef_realtime_to_ingametime: number;
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

export function createDefaultDefaultValuesModel(): DefaultValuesModel {
  return {
    items: ['wood', 'metal', 'stone', 'screw', 'patch'],
    day_start_time: 28800,
    day_end_time: 86459,
    digging_time: 7200,
    coef_realtime_to_ingametime: 192,
    nb_buildings_start: 7,
    nb_skills_start: 9,
    probaBuildingDiscovery: 0.7,
    probaSkillDiscovery: 0.5,
    randomPercentageDefBuilding: 20,
    bonuses: {},
    SKILL_TIME_MULTIPLIER: 1.5,
    BONUS_PRICE_MULTIPLIER: 2,
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
  nextPrice: number;
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
