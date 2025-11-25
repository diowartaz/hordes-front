import { Pipe, PipeTransform } from '@angular/core';

const mapping: Record<string, string> = {
  1: 'assets/icons/pelle.gif',
  2: 'assets/icons/livre.gif',
  3: 'assets/icons/build.webp',
  4: 'assets/icons/sleep.gif',
};

@Pipe({
  name: 'skillToIcon',
  standalone: true,
})
export class SkillToIconPipe implements PipeTransform {
  transform(itemKey: number): string {
    return mapping[itemKey] || 'assets/icons/default.png';
  }
}
