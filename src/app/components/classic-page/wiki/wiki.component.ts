import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [ClassicPageComponent],
  templateUrl: './wiki.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./wiki.component.scss'],
})
export class WikiComponent {}
