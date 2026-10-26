import { AdvancedBonus, AdvancedBuildingModel, CityModel, DefaultValuesModel, Rarity } from 'src/app/models/hordes';
import { bonusEffect } from './bonuses';
import { contains } from './inventory';
import { formatTimeToString } from './time';

const rarityOrder: Record<Rarity, number> = {
  base: 1,
  legendary: 2,
  epic: 3,
  rare: 4,
  common: 5,
};

export function calculateAdvancedBuildings(
  city: CityModel,
  bonuses: Record<number, AdvancedBonus>,
  defaultValues: DefaultValuesModel,
): AdvancedBuildingModel[] {
  const advancedBuildings: AdvancedBuildingModel[] = [];
  const percentBonus = bonusEffect(bonuses[5]);
  for (const building of city.buildings) {
    const timeRequired = building.time * city.speeds.build * (1 - percentBonus);

    const advancedBuilding: AdvancedBuildingModel = {
      ...building,
      enoughRessources: contains(city.inventory, building.inventory || {}),
      timeString: formatTimeToString(timeRequired),
      enoughLvlMax: building.lvl < building.lvl_max,
      expirationCityTime: defaultValues.day_end_time - timeRequired,
    };
    advancedBuildings.push(advancedBuilding);
  }

  // Les bâtiments terminés restent affichés en fin de liste : ils peuvent revenir dans la pioche
  advancedBuildings.sort((a, b) => {
    if (a.enoughLvlMax !== b.enoughLvlMax) {
      return a.enoughLvlMax ? -1 : 1;
    }
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
