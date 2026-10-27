import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, signal } from '@angular/core';
import { BuildingEffectModel } from 'src/app/models/hordes';
import { CityService } from 'src/app/services/city/city.service';
import { buildingEffectText } from '../../utils/building-effects';
import { IconComponent } from '../icon/icon.component';

// Bulle ouverte dans toute l'application : en ouvrir une ferme la précédente
const openTooltip = signal<EffectTooltipComponent | null>(null);

// Sous le bouton, ou au-dessus s'il n'y a pas la place
const POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
];

// Bouton « effet » d'un bâtiment spécial : un clic affiche ou masque une bulle qui décrit l'effet.
// La bulle est rendue dans l'overlay du CDK (fin du <body>) : elle passe au-dessus des cartes voisines
// sans hériter de leur opacité. Elle se ferme au clic ailleurs ou avec Échap ; le clic ne remonte pas jusqu'à la carte.
@Component({
  selector: 'app-effect-tooltip',
  imports: [IconComponent, CdkConnectedOverlay, CdkOverlayOrigin],
  template: `
    <button
      #button
      type="button"
      class="effect-btn"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [attr.aria-expanded]="open()"
      aria-label="Show the building effect"
      (click)="toggle($event)"
    >
      <app-icon name="sparkle" [size]="13" />Effect
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="closeOutside($event, button)"
      (detach)="close()"
    >
      <span class="bubble" role="tooltip">{{ text() }}</span>
    </ng-template>
  `,
  styleUrls: ['./effect-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class EffectTooltipComponent implements OnDestroy {
  private cityService = inject(CityService);

  effect = input.required<BuildingEffectModel>();
  // Jour de la ville en cours : affiche la valeur actuelle des effets qui en dépendent
  day = input<number>();

  readonly positions = POSITIONS;
  open = computed(() => openTooltip() === this);
  text = computed(() => buildingEffectText(this.effect(), this.day(), this.cityService.defaultValues().effect_rules));

  toggle(event: Event) {
    event.stopPropagation();
    openTooltip.set(this.open() ? null : this);
  }

  close() {
    if (this.open()) {
      openTooltip.set(null);
    }
  }

  // Le clic sur le bouton est déjà traité par toggle() : ne pas fermer pour rouvrir aussitôt
  closeOutside(event: MouseEvent, button: HTMLElement) {
    if (!button.contains(event.target as Node)) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.close();
  }
}
