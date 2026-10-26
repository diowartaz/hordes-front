import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createDefaultCityModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';

import { AliveRecapComponent } from './alive-recap.component';

describe('AliveRecapComponent', () => {
  let component: AliveRecapComponent;
  let fixture: ComponentFixture<AliveRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AliveRecapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AliveRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('n’affiche la section Overnight que si des bâtiments spéciaux ont agi pendant la nuit', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Overnight');

    const city = createDefaultCityModel();
    TestBed.inject(CityService).city.set({
      ...city,
      attackRecap: {
        ...city.attackRecap,
        effects: [
          {
            buildingId: 114,
            name: 'Siege Larder',
            defense: 16,
            itemsGained: {},
            itemsSpent: { screw: 2 },
            skillLevels: [],
          },
        ],
      },
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Overnight');
    expect(text).toContain('Siege Larder');
    expect(text).toContain('+16 defense, −2 screw');
  });
});
