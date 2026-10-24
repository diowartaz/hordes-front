import { Pipe, PipeTransform } from '@angular/core';
import { IconName } from '../components/icon/icon.component';
import { BONUS_THEME } from '../utils/theme';

@Pipe({
  name: 'bonusToIcon',
})
export class BonusToIconPipe implements PipeTransform {
  transform(icon: string): IconName {
    return BONUS_THEME[icon]?.icon ?? 'sparkle';
  }
}

@Pipe({
  name: 'bonusToColor',
})
export class BonusToColorPipe implements PipeTransform {
  transform(icon: string): string {
    return BONUS_THEME[icon]?.color ?? 'var(--pink)';
  }
}
