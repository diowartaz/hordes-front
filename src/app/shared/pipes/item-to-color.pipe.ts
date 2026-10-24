import { Pipe, PipeTransform } from '@angular/core';
import { ITEM_THEME } from '../utils/theme';

@Pipe({
  name: 'itemToColor',
})
export class ItemToColorPipe implements PipeTransform {
  transform(item: string): string {
    return ITEM_THEME[item]?.color ?? 'var(--text-mute)';
  }
}
