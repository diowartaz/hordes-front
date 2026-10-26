import { Injectable, effect, signal } from '@angular/core';
import { readStorage, StorageKey, writeStorage } from 'src/app/shared/utils/storage';

export type ThemeId = 'neon' | 'quarantine' | 'blood' | 'signal';

// Thèmes disponibles (styles dans src/_themes.scss) ; swatch : fond et couleurs principales pour l'aperçu
export const THEMES: { id: ThemeId; label: string; swatch: string[] }[] = [
  { id: 'neon', label: 'Neon Arcade', swatch: ['#0b0718', '#ff2ec4', '#22e6ff', '#ffd60a'] },
  { id: 'quarantine', label: 'Quarantine', swatch: ['#0a0c08', '#a8e22a', '#7fb3a2', '#f0bf2a'] },
  { id: 'blood', label: 'Hemorrhage', swatch: ['#090606', '#c2141c', '#8a9ea8', '#d6a23f'] },
  { id: 'signal', label: 'Signal', swatch: ['#0b0804', '#ffa600', '#74d68e', '#ffd65c'] },
];

const DEFAULT_THEME: ThemeId = 'neon';

function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

// Thème choisi par le joueur, mémorisé dans le navigateur et appliqué sur <html data-theme>
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private stored = readStorage(StorageKey.THEME);
  readonly theme = signal<ThemeId>(isThemeId(this.stored) ? this.stored : DEFAULT_THEME);

  constructor() {
    effect(() => {
      document.documentElement.dataset['theme'] = this.theme();
      writeStorage(StorageKey.THEME, this.theme());
    });
  }

  setTheme(theme: ThemeId) {
    this.theme.set(theme);
  }
}
