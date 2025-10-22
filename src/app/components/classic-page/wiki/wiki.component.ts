import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClassicPageComponent } from '../classic-page.component';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [CommonModule, ClassicPageComponent],
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss'],
})
export class WikiComponent {}
