import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityService } from 'src/app/services/city/city.service';

import { EffectToastComponent } from './effect-toast.component';

describe('EffectToastComponent', () => {
  let fixture: ComponentFixture<EffectToastComponent>;
  let cityService: CityService;

  beforeEach(async () => {
    jasmine.clock().install();
    await TestBed.configureTestingModule({ imports: [EffectToastComponent] }).compileComponents();
    cityService = TestBed.inject(CityService);
    fixture = TestBed.createComponent(EffectToastComponent);
    fixture.detectChanges();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('affiche ce que les bâtiments spéciaux ont fait pendant l’action, puis s’efface', () => {
    expect(fixture.nativeElement.querySelector('.effect-toast')).toBeNull();

    cityService.actionEffects.set([
      { buildingId: 117, name: 'Salvage Crane', defense: 0, itemsGained: { wood: 1 }, itemsSpent: {}, skillLevels: [] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.effect-toast').textContent).toContain('Salvage Crane');
    expect(fixture.nativeElement.textContent).toContain('+1 wood');

    jasmine.clock().tick(4000);
    fixture.detectChanges();
    expect(cityService.actionEffects()).toEqual([]);
    expect(fixture.nativeElement.querySelector('.effect-toast')).toBeNull();
  });
});
