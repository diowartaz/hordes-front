import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CatalogBuildingModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';

import { DeckComponent } from './deck.component';

describe('DeckComponent', () => {
  let fixture: ComponentFixture<DeckComponent>;
  let host: HTMLElement;

  const wall: CatalogBuildingModel = {
    id: 1,
    name: 'Scrap Wall',
    rarity: 'common',
    defense: 12,
    lvl_max: 3,
    time: 3600,
    inventory: { wood: 4 },
  };
  const totem: CatalogBuildingModel = {
    id: 2,
    name: 'Night Totem',
    rarity: 'epic',
    defense: 0,
    lvl_max: 2,
    time: 7200,
    inventory: { metal: 2 },
    effect: { kind: 'nightlyGrowth', value: 3 } as any,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const cityService = TestBed.inject(CityService);
    cityService.catalogBuildings.set([wall, totem]);
    cityService.stats.update((stats) => ({ ...stats, deck: [1, 2], collection: { 1: 2, 2: 1 } }));

    fixture = TestBed.createComponent(DeckComponent);
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  function slotWrap(name: string): HTMLElement {
    return [...host.querySelectorAll<HTMLElement>('.slot-wrap')].find((el) => el.textContent?.includes(name))!;
  }

  it("affiche la carte complète du plan survolé, et la masque à la sortie", async () => {
    expect(host.querySelector('.preview')).toBeNull();

    slotWrap('Scrap Wall').dispatchEvent(new MouseEvent('mouseenter'));
    await fixture.whenStable();
    const preview = host.querySelector('.preview')!;
    expect(preview.querySelector('app-building-card')?.textContent).toContain('Scrap Wall');
    expect(preview.textContent).toContain('common');
    expect(preview.textContent).toContain('×2');
    expect(preview.querySelector('.preview-effect')).toBeNull();

    slotWrap('Scrap Wall').dispatchEvent(new MouseEvent('mouseleave'));
    await fixture.whenStable();
    expect(host.querySelector('.preview')).toBeNull();
  });

  it("écrit en clair l'effet d'un bâtiment spécial", async () => {
    slotWrap('Night Totem').dispatchEvent(new MouseEvent('mouseenter'));
    await fixture.whenStable();
    expect(host.querySelector('.preview-effect')?.textContent).toContain('+3 permanent defense');
  });
});
