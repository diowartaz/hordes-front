import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classic-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classic-page.component.html',
  styleUrls: ['./classic-page.component.scss'],
})
export class ClassicPageComponent {
  @Input() title = '';
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
