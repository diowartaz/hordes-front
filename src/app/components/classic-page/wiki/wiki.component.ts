import { Component } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'app-wiki',
  imports: [ClassicPageComponent, IconComponent],
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss'],
})
export class WikiComponent {}
