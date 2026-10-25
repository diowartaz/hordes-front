import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityService } from 'src/app/services/city/city.service';
import { createDefaultCityModel } from 'src/app/models/hordes';
import { removeStorage, StorageKey } from 'src/app/shared/utils/storage';

import { DiggingsComponent } from './diggings.component';

describe('DiggingsComponent', () => {
  let component: DiggingsComponent;
  let fixture: ComponentFixture<DiggingsComponent>;
  let cityService: CityService;

  beforeEach(async () => {
    removeStorage(StorageKey.DIG_MODE);
    await TestBed.configureTestingModule({
      imports: [DiggingsComponent],
    }).compileComponents();

    cityService = TestBed.inject(CityService);
    cityService.city.set({ ...createDefaultCityModel(), time: 8 * 3600, dig_offer: ['metal', 'screw'] });
    spyOn(cityService, 'findItems');
    cityService.cityTimeSeconds = signal(8 * 3600);
    fixture = TestBed.createComponent(DiggingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche une carte par ressource proposée, en mode Pick par défaut', () => {
    expect(component.mode()).toBe('pick');
    expect(fixture.nativeElement.querySelector('.dig-btn')).toBeNull();
    const cards = fixture.nativeElement.querySelectorAll('.offer-card');
    expect(cards.length).toBe(2);
    expect(cards[1].textContent).toContain('screw');
  });

  it('fouille une fois en gardant la ressource choisie', () => {
    fixture.nativeElement.querySelectorAll('.offer-card')[1].click();
    expect(cityService.findItems).toHaveBeenCalledWith(1, 'screw');
  });

  it('fouille une fois au hasard, en mode Random', () => {
    fixture.nativeElement.querySelectorAll('.tab')[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.offer-card')).toBeNull();
    fixture.nativeElement.querySelector('.dig-btn').click();
    expect(cityService.findItems).toHaveBeenCalledWith(1);
  });

  it('fouille au hasard le maximum de fois avant l’attaque', () => {
    component.setMode('random');
    fixture.detectChanges();
    // 8h → fin de journée, fouilles de 2 h
    expect(component.maxDigs()).toBe(8);
    fixture.nativeElement.querySelector('.dig-btn.max').click();
    expect(cityService.findItems).toHaveBeenCalledWith('max');
  });

  it('masque le bouton maximum quand une seule fouille est possible', () => {
    cityService.cityTimeSeconds = signal(22 * 3600);
    component.setMode('random');
    fixture.detectChanges();
    expect(component.maxDigs()).toBe(1);
    expect(fixture.nativeElement.querySelector('.dig-btn.max')).toBeNull();
  });

  it('mémorise le mode choisi', () => {
    component.setMode('random');
    const next = TestBed.createComponent(DiggingsComponent).componentInstance;
    expect(next.mode()).toBe('random');
  });
});
