import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skill-recap',
  standalone: true,
  templateUrl: './skill-recap.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./skill-recap.component.scss'],
})
export class SkillRecapComponent {
  @Input() skill: any = null;
}
