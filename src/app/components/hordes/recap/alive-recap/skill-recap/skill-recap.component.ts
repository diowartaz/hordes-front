import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-recap',
  templateUrl: './skill-recap.component.html',
  styleUrls: ['./skill-recap.component.scss']
})
export class SkillRecapComponent {
  @Input() skill: any = null;
}
