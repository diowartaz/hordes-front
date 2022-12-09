export interface PlayerModel {
  city: CityModel;
  data: DataModel;
}

export interface DataModel {
  personal_best_day: number;
  personal_best_zb: number;
  xp: number;
}

export interface CityModel {
  day: number;
  defense: number;
  time: number;
  nb_zb_next_attack_max: number;
  nb_zb_next_attack_min: number;
  nb_zb_previous_attack: number;
  buildings: Array<BuildingModel>;
  nb_zb_history: Array<number>;
  inventory: object;
  speeds: SpeedsModel;
}

export interface SpeedsModel {
  build: number;
  dig: number;
  learn: number;
}

export interface BuildingModel {
  id: number;
  defense: number;
  time: number;
  lvl: number;
  lvl_max: number;
  name: string;
  inventory: object;
  customInventory?: customInventoryModel;
}

export interface customInventoryModel {
  found: number;
  nb: number;
  src: string;
  name: string;
}
