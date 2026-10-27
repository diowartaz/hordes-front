import { Component, computed, inject, input, output, signal } from '@angular/core';
import { BoosterCardModel } from 'src/app/models/game';
import { CityService } from 'src/app/services/city/city.service';
import { BuildingCardComponent } from 'src/app/shared/components/building-card/building-card.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

// Révélation des plans d'un booster, un par un
@Component({
  selector: 'app-booster-opening',
  imports: [BuildingCardComponent, IconComponent],
  templateUrl: './booster-opening.component.html',
  styleUrls: ['./booster-opening.component.scss'],
})
export class BoosterOpeningComponent {
  readonly cityService = inject(CityService);

  cards = input.required<BoosterCardModel[]>();
  boosterName = input('');
  canOpenAnother = input(false);
  openAnother = output<void>();
  closed = output<void>();

  revealed = signal(0);
  allRevealed = computed(() => this.revealed() >= this.cards().length);
  shownCards = computed(() =>
    this.cards().map((card) => ({
      ...card,
      building: this.cityService.catalogBuildings().find((b) => b.id === card.building_id),
      count: this.cityService.collection()[card.building_id] ?? 1,
    })),
  );

  reveal(index: number): void {
    // Les plans se révèlent dans l'ordre : cliquer sur un plan caché révèle le suivant
    if (index >= this.revealed()) {
      this.revealed.update((count) => count + 1);
    }
  }

  revealAll(): void {
    this.revealed.set(this.cards().length);
  }

  again(): void {
    this.revealed.set(0);
    this.openAnother.emit();
  }
}
