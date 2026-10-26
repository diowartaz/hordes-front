import { BuildingEffectModel } from 'src/app/models/hordes';

// Description d'un effet de bâtiment spécial (règles dans hordes-api, src/game/city/building-effects.ts).
// `day` : jour de la ville en cours, pour afficher la valeur actuelle des effets qui en dépendent.
export function buildingEffectText(effect: BuildingEffectModel, day?: number): string {
  const { value } = effect;
  switch (effect.kind) {
    case 'nightlyGrowth':
      return `Each night survived: +${value} permanent defense per level.`;
    case 'compoundGrowth':
      return `Each night survived: +${Math.round(value * 100)}% of the city's defense per level, permanently.`;
    case 'buildDayScaling':
      return (
        `Each level built gives ${value} × the current day in defense.` +
        (day ? ` Today: +${value * day} per level.` : '')
      );
    case 'skillDefense':
      return `Each skill level learned gives +${value} defense per level of this building.`;
    case 'stockDefense':
      return `Tonight only: +${value} defense per resource in stock, per level.`;
    case 'randomNightDefense':
      return `Tonight only: random defense between 0 and ${value} per level.`;
  }
}
