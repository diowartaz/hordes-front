import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, signal } from '@angular/core';
import { BuildingEffectModel } from 'src/app/models/hordes';
import { buildingEffectText } from '../../utils/building-effects';
import { IconComponent } from '../icon/icon.component';

// Bouton « effet » d'un bâtiment spécial : un clic affiche ou masque une bulle qui décrit l'effet.
// La bulle se ferme au clic ailleurs ou avec Échap ; le clic ne remonte pas jusqu'à la carte.
@Component({
  selector: 'app-effect-tooltip',
  imports: [IconComponent],
  template: `
    <button
      type="button"
      class="effect-btn"
      [attr.aria-expanded]="open()"
      aria-label="Show the building effect"
      (click)="toggle($event)"
    >
      <app-icon name="sparkle" [size]="13" />Effect
    </button>
    @if (open()) {
      <span class="bubble" role="tooltip">{{ text() }}</span>
    }
  `,
  styleUrls: ['./effect-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeOutside($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
})
export class EffectTooltipComponent {
  private host = inject(ElementRef<HTMLElement>);

  effect = input.required<BuildingEffectModel>();
  // Jour de la ville en cours : affiche la valeur actuelle des effets qui en dépendent
  day = input<number>();

  open = signal(false);
  text = computed(() => buildingEffectText(this.effect(), this.day()));

  toggle(event: Event) {
    event.stopPropagation();
    this.open.update((open) => !open);
  }

  closeOutside(event: Event) {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
