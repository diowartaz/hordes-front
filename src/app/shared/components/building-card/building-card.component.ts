import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CatalogBuildingModel } from 'src/app/models/hordes';
import { RarityToColorPipe } from '../../pipes/rarity-to-color.pipe';
import { formatTimeToString } from '../../utils/time';
import { IconComponent } from '../icon/icon.component';
import { ResourceGemComponent } from '../resource-gem/resource-gem.component';

// Carte d'un plan du catalogue (collection, deck, boosters). Le contenu projeté s'affiche en pied de carte.
@Component({
  selector: 'app-building-card',
  imports: [KeyValuePipe, IconComponent, ResourceGemComponent, RarityToColorPipe],
  templateUrl: './building-card.component.html',
  styleUrls: ['./building-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingCardComponent {
  building = input.required<CatalogBuildingModel>();
  // Exemplaires possédés : 0 = plan pas encore obtenu
  count = input(1);
  inDeck = input(false);
  // Version resserrée (éditeur de deck) : nom plus petit, rareté indiquée par la seule bordure
  compact = input(false);

  locked = computed(() => this.count() === 0);
  time = computed(() => formatTimeToString(this.building().time));
}
