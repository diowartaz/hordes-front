import { Component, Input } from '@angular/core';

export interface SkillDiscovery {
  name: string;
  lvl: number;
  old_lvl_max: number;
  lvl_max: number;
}

@Component({
  selector: 'app-skill-recap',
  templateUrl: './skill-recap.component.html',
  styleUrls: ['./skill-recap.component.scss'],
})
export class SkillRecapComponent {
  @Input({ required: true }) skill!: SkillDiscovery;
}
