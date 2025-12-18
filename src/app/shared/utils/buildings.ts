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
  const flatBonus = bonuses[4];
  const percentBonus = bonuses[5];
  for (const building of city.buildings) {
    const timeRequired =
      building.time * city.speeds.build * city.speeds.general * (1 - percentBonus.value * percentBonus.lvl) -
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
    const resA = a.enoughRessources ? 1 : 0;
    const resB = b.enoughRessources ? 1 : 0;

    if (resA !== resB) {
      return resB - resA;
    }
    if (a.expirationCityTime !== b.expirationCityTime) {
      return a.expirationCityTime - b.expirationCityTime;
    }
    const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
    if (rarityDiff !== 0) {
      return rarityDiff;
    }
    return b.defense_ratio_percentage - a.defense_ratio_percentage;
  });
  return advancedBuildings;
}
