import { AdvancedSkillModel, CityModel, DefaultValuesModel, SkillModel } from 'src/app/models/hordes';
import { formatTimeToString } from './time';

export function calculateAdvancedSkills(city: CityModel, defaultValues: DefaultValuesModel): AdvancedSkillModel[] {
  const advancedSkills: AdvancedSkillModel[] = [];
  console.log(city.skills);

  for (const skill of city.skills) {
    const timeRequired = skill.time * city.speeds.learn;

    const enoughTime = city.time + timeRequired <= defaultValues.day_end_time;
    const timeoutSeconds = (timeRequired - city.time) / defaultValues.coef_realtime_to_ingametime;

    const advancedSkill: AdvancedSkillModel = {
      ...skill,
      enoughTime: enoughTime,
      timeString: formatTimeToString(timeRequired, false),
      enoughLvlMax: skill.lvl < skill.lvl_max,
      timeoutSeconds: timeoutSeconds,
      percentageEfficacityStringBefore: getPercentageEfficacity(skill, 0, defaultValues),
      percentageEfficacityStringAfter: getPercentageEfficacity(skill, 1, defaultValues),
    };
    advancedSkills.push(advancedSkill);

    // Mettre ça en place
    // this.setTimeoutRefs.push(
    //     setTimeout(() => {
    //       skill.enoughTime = false;
    //     }, timeoutSeconds * 1000),
    //   );
  }

  return advancedSkills;
}

function getPercentageEfficacity(skill: SkillModel, plusLevel: number, defaultValues: DefaultValuesModel): string {
  if (skill.id == 4) {
    return formatTimeToString(defaultValues.day_start_time - skill.reduce_time_seconds * (skill.lvl + plusLevel));
  }
  return String(Math.round((1 - skill.avantage_per_lvl * (skill.lvl + plusLevel)) * 100)) + '%';
}
