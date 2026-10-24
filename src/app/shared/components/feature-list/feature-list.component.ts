import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

// Titre du jeu et liste des fonctionnalités (accueil, création de ville)
@Component({
  selector: 'app-feature-list',
  imports: [IconComponent],
  template: `
    <header class="brand">
      <app-icon name="skull" [size]="44" />
      <h1 class="neon-title">Zombie Waves</h1>
      <span class="label">Survive one more night</span>
    </header>
    <ul class="features">
      @for (feature of features; track feature.text) {
        <li [style.--c]="feature.color">
          <span class="icon-tile"><app-icon [name]="feature.icon" [size]="18" /></span>
          {{ feature.text }}
        </li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 18px;
      width: 100%;
    }
    .brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding-top: 12px;
      color: var(--pink);
      app-icon {
        filter: drop-shadow(0 0 10px var(--pink));
      }
      .neon-title {
        font-size: 34px;
        text-align: center;
      }
    }
    .features {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
      gap: 8px;
      li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px 8px 8px;
        border-radius: var(--radius-m);
        background: var(--surface-2);
        border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
        font-size: 16px;
        font-weight: 700;
      }
      .icon-tile {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        box-shadow: 0 0 10px var(--c);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureListComponent {
  readonly features: { icon: IconName; color: string; text: string }[] = [
    { icon: 'skull', color: 'var(--pink)', text: 'Try your best to survive' },
    { icon: 'dig', color: 'var(--yellow)', text: 'Search for resources' },
    { icon: 'build', color: 'var(--orange)', text: 'Build powerful defenses' },
    { icon: 'book', color: 'var(--cyan)', text: 'Learn useful skills' },
    { icon: 'zombie', color: 'var(--danger)', text: 'Defeat zombies every night' },
    { icon: 'sparkle', color: 'var(--violet-light)', text: 'Accumulate experience and levels' },
    { icon: 'trophy', color: 'var(--green)', text: 'Conquer the leaderboard!' },
  ];
}
