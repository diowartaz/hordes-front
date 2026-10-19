import { Component, computed, inject, signal } from '@angular/core';
import { CityService } from 'src/app/services/city/city.service';
import { RecapHeaderComponent } from '../recap-header/recap-header.component';
import { BuildingRecapComponent } from './building-recap/building-recap.component';
import { SkillRecapComponent, SkillDiscovery } from './skill-recap/skill-recap.component';

@Component({
  selector: 'app-alive-recap',
  imports: [RecapHeaderComponent, BuildingRecapComponent, SkillRecapComponent],
  templateUrl: './alive-recap.component.html',
  styleUrls: ['./alive-recap.component.scss'],
})
export class AliveRecapComponent {
  public cityService = inject(CityService);

  // Index des bâtiments de l'abri de l'architecte choisis par le joueur
  selectedBuildings = signal<ReadonlySet<number>>(new Set());

  architectBuildings = computed(() => this.cityService.city().attackRecap.architect_shelter_buildings);
  nbChoicesAvailable = computed(() => this.architectBuildings().length);
  nbMaxChoices = computed(() => this.nbChoicesAvailable() - 2);

  libraryDiscoveries = computed<SkillDiscovery[]>(() => {
    const city = this.cityService.city();
    const discoveries: SkillDiscovery[] = [];
    for (const [skillId, nbNewLevels] of Object.entries(city.attackRecap.library_discoveries)) {
      const skill = city.skills.find((s) => String(s.id) === skillId);
      if (skill) {
        discoveries.push({
          name: skill.name,
          lvl: skill.lvl,
          old_lvl_max: skill.lvl_max - nbNewLevels,
          lvl_max: skill.lvl_max,
        });
      }
    }
    return discoveries;
  });

  startDay() {
    this.cityService.startDay([...this.selectedBuildings()].sort((a, b) => a - b));
  }

  toggleBuilding(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const selected = new Set(this.selectedBuildings());

    if (input.checked && selected.size >= this.nbMaxChoices()) {
      input.checked = false; // limite atteinte : on annule le clic
      return;
    }
    if (input.checked) {
      selected.add(index);
    } else {
      selected.delete(index);
    }
    this.selectedBuildings.set(selected);
  }
}
