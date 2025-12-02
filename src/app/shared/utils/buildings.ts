import { AdvancedBonus, AdvancedBuildingModel, CityModel, DefaultValuesModel } from 'src/app/models/hordes';
import { contains } from './inventory';
import { formatTimeToString } from './time';

const rarityOrder: Record<string, number> = {
  base: 1,
  epic: 2,
  rare: 3,
  common: 4,
};

export function calculateAdvancedBuildings(
  city: CityModel,
  bonuses: Record<number, AdvancedBonus>,
  defaultValues: DefaultValuesModel,
): AdvancedBuildingModel[] {
  const advancedBuildings: AdvancedBuildingModel[] = [];

  for (const building of city.buildings) {
    const flatBonus = bonuses[4];
    const percentBonus = bonuses[5];
    const timeRequired =
      building.time * city.speeds.build * (1 - percentBonus.value * percentBonus.lvl) -
      flatBonus.value * flatBonus.lvl * 60;

    const advancedBuilding: AdvancedBuildingModel = {
      ...building,
      enoughRessources: contains(city.inventory, building.inventory || {}),
      timeString: formatTimeToString(timeRequired),
      enoughLvlMax: building.lvl < building.lvl_max,
      expirationCityTime: defaultValues.day_end_time - timeRequired,
    };
    if (building.lvl < building.lvl_max) {
      advancedBuildings.push(advancedBuilding);
    }
  }

  advancedBuildings.sort((a, b) => {
    const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
    if (rarityDiff !== 0) {
      return rarityDiff;
    }
    return b.defense_ratio_percentage - a.defense_ratio_percentage;
  });
  return advancedBuildings;
}
