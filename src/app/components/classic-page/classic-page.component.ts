import { Location } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';

@Component({
  selector: 'app-classic-page',
  standalone: true,
  imports: [],
  templateUrl: './classic-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./classic-page.component.scss'],
})
export class ClassicPageComponent {
  private location = inject(Location);

  @Input() title = '';

  goBack() {
    this.location.back();
  }
}
