import { StorageKey, writeStorage } from '../shared/utils/storage';
import { firstSegment, readPlayRoute, routeForState, UserState } from './router';

describe('router', () => {
  afterEach(() => localStorage.removeItem(StorageKey.PLAY_ROUTE));

  it("extrait le premier segment d'une URL", () => {
    expect(firstSegment('/play/dig?x=1')).toBe('play');
    expect(firstSegment('/leaderboard#top')).toBe('leaderboard');
    expect(firstSegment('/')).toBe('');
  });

  it("revient à l'onglet de jeu mémorisé", () => {
    writeStorage(StorageKey.PLAY_ROUTE, 'build');
    expect(routeForState(UserState.PLAYING)).toBe('/play/build');
  });

  it('ignore un onglet mémorisé invalide', () => {
    writeStorage(StorageKey.PLAY_ROUTE, 'undefined');
    expect(readPlayRoute()).toBe('dig');
  });

  it('associe chaque état à sa page', () => {
    expect(routeForState(UserState.NOT_LOADED_PLAYER)).toBe('/load-player');
    expect(routeForState(UserState.NO_CITY)).toBe('/create-city');
    expect(routeForState(UserState.RECAP)).toBe('/recap');
    expect(routeForState(UserState.DEATH_RECAP)).toBe('/death-recap');
  });
});
