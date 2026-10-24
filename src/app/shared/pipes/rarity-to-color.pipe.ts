import { Pipe, PipeTransform } from '@angular/core';
import { RARITY_COLOR } from '../utils/theme';

@Pipe({
  name: 'rarityToColor',
})
export class RarityToColorPipe implements PipeTransform {
  transform(rarity: string): string {
    return RARITY_COLOR[rarity] ?? 'var(--text-mute)';
  }
}
