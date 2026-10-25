import { CatalogBuildingModel, Rarity } from 'src/app/models/hordes';
import { autocompleteDeck, byRarityDesc, deckProblems, rarityCounts, resourceShares } from './deck';

function plan(id: number, rarity: Rarity, inventory: Record<string, number>, lvl_max = 1): CatalogBuildingModel {
  return { id, name: 'b' + id, rarity, defense: 10, lvl_max, time: 3600, inventory };
}

describe('deck', () => {
  const catalog = [
    plan(1, 'common', { wood: 2 }, 2),
    plan(2, 'rare', { metal: 1, stone: 3 }),
    plan(3, 'epic', { screw: 4 }),
    plan(4, 'epic', { patch: 4 }),
  ];
  const owned = { 1: 1, 2: 2, 3: 1, 4: 1 };
  const rules = { size: 3 };

  it('accepte un deck complet de plans possédés', () => {
    expect(deckProblems([1, 2, 3], owned, rules)).toEqual([]);
  });

  it('signale les plans manquants et non possédés', () => {
    expect(deckProblems([1], owned, rules)).toEqual(['2 more plans needed']);
    expect(deckProblems([1, 2, 3], { 1: 1, 2: 1 }, rules)).toEqual(['Some plans are not in your collection']);
    expect(deckProblems([1, 3, 4], owned, rules)).toEqual([]);
  });

  it('calcule la part de chaque ressource, niveaux max compris', () => {
    const shares = resourceShares([catalog[0], catalog[1]]);
    expect(shares.wood).toBeCloseTo(0.5);
    expect(shares.metal).toBeCloseTo(0.125);
    expect(shares.stone).toBeCloseTo(0.375);
    expect(shares.patch).toBe(0);
  });

  it('trie par rareté décroissante puis par nom', () => {
    expect([...catalog].sort(byRarityDesc).map((b) => b.id)).toEqual([3, 4, 2, 1]);
  });

  it('complète le deck avec les plus rares, en équilibrant les ressources', () => {
    const pool = [
      plan(10, 'common', { wood: 1 }),
      plan(11, 'epic', { wood: 2 }),
      plan(12, 'epic', { metal: 2 }),
      plan(13, 'rare', { stone: 1 }),
      plan(14, 'legendary', { wood: 1 }),
    ];
    const all = { 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 };
    // Légendaire d'abord, puis l'épique en métal (le bois est déjà couvert), puis l'autre épique
    expect(autocompleteDeck([], all, pool, 3)).toEqual([14, 12, 11]);
    // Garde le deck existant, ignore les plans non possédés et s'arrête faute de candidats
    expect(autocompleteDeck([10], { 10: 1, 13: 1 }, pool, 5)).toEqual([10, 13]);
  });

  it('compte les plans par rareté', () => {
    expect(rarityCounts(catalog)).toEqual({ common: 1, rare: 1, epic: 2 });
  });
});
