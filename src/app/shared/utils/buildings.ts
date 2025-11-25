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

    const enoughTime = city.time + timeRequired <= defaultValues.day_end_time;
    const timeoutSeconds = (timeRequired - city.time) / defaultValues.coef_realtime_to_ingametime;

    const advancedBuilding: AdvancedBuildingModel = {
      ...building,
      enoughRessources: contains(city.inventory, building.inventory),
      enoughTime: enoughTime,
      buildingTimeString: formatTimeToString(timeRequired, false),
      enoughLvlMax: building.lvl < building.lvl_max,
      timeoutSeconds: timeoutSeconds,
    };
    advancedBuildings.push(advancedBuilding);

    // Mettre ça en place
    // this.setTimeoutRefs.push(
    //     setTimeout(() => {
    //       building.enoughTime = false;
    //     }, timeoutSeconds * 1000),
    //   );
  }

  advancedBuildings.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]); //TODO vérifier que c'est dans le bon ordre
  return advancedBuildings;
}
