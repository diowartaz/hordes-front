import { Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-classic-page',
  imports: [IconComponent],
  templateUrl: './classic-page.component.html',
  styleUrls: ['./classic-page.component.scss'],
})
export class ClassicPageComponent {
  private location = inject(Location);

  @Input() title = '';
  @Input() subtitle = '';
  // Couleur du halo du titre
  @Input() glow = 'var(--pink)';

  goBack() {
    this.location.back();
  }
}
