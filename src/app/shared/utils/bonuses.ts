import { AdvancedBonus, BonusWithoutLvl, StatsModel } from 'src/app/models/hordes';

export function computeBonuses(
  stats: StatsModel,
  referencesBonuses: BonusWithoutLvl[],
): Record<number, AdvancedBonus> {
  const hasBonuses = Object.keys(stats.bonuses).length > 0;
  const hasReferences = Object.keys(referencesBonuses).length > 0;

  if (!hasBonuses || !hasReferences) {
    return {};
  }

  const bonuses: Record<number, AdvancedBonus> = {};
  for (const referencesBonusId in referencesBonuses) {
    bonuses[referencesBonusId] = {
      ...referencesBonuses[referencesBonusId],
      lvl: stats.bonuses[referencesBonusId],
      enoughMoney: true,
      enoughLvlMax: true,
    };
  }

  return bonuses;
}
