import { Pipe, PipeTransform } from '@angular/core';

const mapping: Record<string, string> = {
  base: 'assets/icons/base_plan.webp',
  common: 'assets/icons/common_plan_c.gif',
  rare: 'assets/icons/rare_plan.gif',
  epic: 'assets/icons/epic_plan.gif',
};

@Pipe({
  name: 'buildingRarityToIcon',
  standalone: true,
})
export class BuildingRarityToIconPipe implements PipeTransform {
  transform(itemKey: string): string {
    return mapping[itemKey] || 'assets/icons/default.png';
  }
}
