import { Pipe, PipeTransform } from '@angular/core';

const mapping: Record<string, string> = {
  wood: 'assets/icons/wood.gif',
  metal: 'assets/icons/metal.gif',
  stone: 'assets/icons/caillou.webp',
  screw: 'assets/icons/screw.webp',
  patch: 'assets/icons/patch.webp',
};

@Pipe({
  name: 'itemToIcon',
  standalone: true,
})
export class ItemIconPipe implements PipeTransform {
  transform(itemKey: string): string {
    return mapping[itemKey] || 'assets/icons/default.png';
  }
}
