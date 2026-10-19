import { Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-classic-page',
  imports: [],
  templateUrl: './classic-page.component.html',
  styleUrls: ['./classic-page.component.scss'],
})
export class ClassicPageComponent {
  private location = inject(Location);

  @Input() title = '';

  goBack() {
    this.location.back();
  }
}
