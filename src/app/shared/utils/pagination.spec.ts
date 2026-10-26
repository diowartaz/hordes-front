import { pageWindow } from './pagination';

describe('pageWindow', () => {
  it('affiche toutes les pages quand il y en a peu', () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('remplace les pages éloignées par des ellipses', () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, null, 10]);
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    expect(pageWindow(10, 10)).toEqual([1, null, 9, 10]);
  });

  it('affiche la page plutôt qu’une ellipse qui n’en cacherait qu’une', () => {
    expect(pageWindow(4, 10)).toEqual([1, 2, 3, 4, 5, null, 10]);
    expect(pageWindow(7, 10)).toEqual([1, null, 6, 7, 8, 9, 10]);
  });

  it('aucune page quand le classement est vide', () => {
    expect(pageWindow(1, 0)).toEqual([]);
  });
});
