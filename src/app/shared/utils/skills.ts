import { AdvancedSkillModel, CityModel, DefaultValuesModel, SkillModel } from 'src/app/models/hordes';
import { formatTimeToString } from './time';

export function calculateAdvancedSkills(city: CityModel, defaultValues: DefaultValuesModel): AdvancedSkillModel[] {
  const advancedSkills: AdvancedSkillModel[] = [];
  for (const skill of city.skills) {
    // Durée calculée par le serveur : vitesses, bonus et bâtiments spéciaux compris
    const timeRequired = skill.next_level_duration;
    const advancedSkill: AdvancedSkillModel = {
      ...skill,
      expirationCityTime: defaultValues.day_end_time - timeRequired,
      timeString: formatTimeToString(timeRequired),
      enoughLvlMax: skill.lvl < skill.lvl_max,
      percentageEfficacityStringBefore: getPercentageEfficacity(skill, 0, defaultValues),
      percentageEfficacityStringAfter: getPercentageEfficacity(skill, 1, defaultValues),
    };
    if (advancedSkill.lvl_max > 0) {
      advancedSkills.push(advancedSkill);
    }
  }

  return advancedSkills;
}

function getPercentageEfficacity(skill: SkillModel, plusLevel: number, defaultValues: DefaultValuesModel): string {
  if (skill.id == 4) {
    //insomniac
    return formatTimeToString(defaultValues.day_start_time - skill.reduce_time_seconds * (skill.lvl + plusLevel));
  }
  return String(Math.round((1 - skill.avantage_per_lvl * (skill.lvl + plusLevel)) * 100)) + '%';
}
