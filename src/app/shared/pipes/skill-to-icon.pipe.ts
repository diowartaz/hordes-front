import { Pipe, PipeTransform } from '@angular/core';
import { IconName } from '../components/icon/icon.component';
import { SKILL_THEME } from '../utils/theme';

@Pipe({
  name: 'skillToIcon',
})
export class SkillToIconPipe implements PipeTransform {
  transform(skillId: number): IconName {
    return SKILL_THEME[skillId]?.icon ?? 'sparkle';
  }
}

@Pipe({
  name: 'skillToColor',
})
export class SkillToColorPipe implements PipeTransform {
  transform(skillId: number): string {
    return SKILL_THEME[skillId]?.color ?? 'var(--cyan)';
  }
}
