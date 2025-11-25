import { AdvancedBonus, BonusWithoutLvl, DefaultValuesModel, StatsModel } from 'src/app/models/hordes';

export function computeBonuses(
  stats: StatsModel,
  defaultValues: DefaultValuesModel,
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
      enoughMoney:
        referencesBonuses[referencesBonusId].price *
          defaultValues.BONUS_PRICE_MULTIPLIER *
          stats.bonuses[referencesBonusId] <
        stats.money,
      enoughLvlMax: stats.bonuses[referencesBonusId] < referencesBonuses[referencesBonusId].lvl_max,
    };
  }

  return bonuses;
}
